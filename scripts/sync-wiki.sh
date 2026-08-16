#!/usr/bin/env bash

# Vats Editor - GitHub Wiki Sync Script
# Synchronizes markdown files in wiki/ to the GitHub Wiki repository.

set -euo pipefail

# ANSI color codes
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
BLUE="\033[0;34m"
NC="\033[0m"

log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1" >&2
}

# Resolve directory locations
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
WIKI_DIR="${REPO_ROOT}/wiki"
WIKI_REMOTE="${1:-${WIKI_REMOTE_URL:-git@github.com:Shreyvats01/vats-editor.wiki.git}}"

log_info "Starting Vats Editor wiki synchronization..."
log_info "Repository root: ${REPO_ROOT}"
log_info "Source wiki directory: ${WIKI_DIR}"
log_info "Target remote: ${WIKI_REMOTE}"

# Verify source wiki directory exists
if [[ ! -d "${WIKI_DIR}" ]]; then
  log_error "Wiki directory not found at ${WIKI_DIR}"
  exit 1
fi

# Count markdown files
MD_COUNT=$(find "${WIKI_DIR}" -maxdepth 1 -name "*.md" | wc -l)
if [[ "${MD_COUNT}" -eq 0 ]]; then
  log_error "No markdown files found in ${WIKI_DIR}"
  exit 1
fi
log_info "Found ${MD_COUNT} markdown file(s) to synchronize."

# Create temporary working directory
TEMP_DIR="$(mktemp -d /tmp/vats-wiki-sync.XXXXXX)"
cleanup() {
  log_info "Cleaning up temporary files..."
  rm -rf "${TEMP_DIR}"
}
trap cleanup EXIT

# Check SSH connection / access to remote repository
log_info "Checking access to remote wiki repository..."
REMOTE_ACCESSIBLE=true
if ! git ls-remote "${WIKI_REMOTE}" &>/dev/null; then
  log_warn "Remote repository check failed or repository is uninitialized."
  REMOTE_ACCESSIBLE=false
fi

CLONED=false
if [[ "${REMOTE_ACCESSIBLE}" == "true" ]]; then
  log_info "Cloning existing wiki repository into temporary workspace..."
  if git clone --quiet "${WIKI_REMOTE}" "${TEMP_DIR}"; then
    CLONED=true
    log_info "Existing wiki repository cloned successfully."
  else
    log_warn "Clone failed, falling back to local git initialization."
  fi
fi

if [[ "${CLONED}" == "false" ]]; then
  log_info "Initializing new git repository in temporary workspace..."
  git -C "${TEMP_DIR}" init --quiet
  git -C "${TEMP_DIR}" remote add origin "${WIKI_REMOTE}"
  # Default branch for GitHub wikis is master
  git -C "${TEMP_DIR}" checkout -b master 2>/dev/null || true
fi

# Copy all markdown files from source to temporary repo
log_info "Copying wiki markdown files to target workspace..."
cp -R "${WIKI_DIR}"/*.md "${TEMP_DIR}/"

# Configure local git user if not present in temp environment
if ! git -C "${TEMP_DIR}" config user.name >/dev/null 2>&1; then
  git -C "${TEMP_DIR}" config user.name "github-actions[bot]"
fi
if ! git -C "${TEMP_DIR}" config user.email >/dev/null 2>&1; then
  git -C "${TEMP_DIR}" config user.email "github-actions[bot]@users.noreply.github.com"
fi

# Stage files
git -C "${TEMP_DIR}" add -A

# Check for modifications
if git -C "${TEMP_DIR}" diff --cached --quiet; then
  log_success "Wiki is already up to date. No changes to synchronize."
  exit 0
fi

# Show status summary
log_info "Changes detected:"
git -C "${TEMP_DIR}" status --short

# Commit changes
COMMIT_TIMESTAMP="$(date -u +"%Y-%m-%d %H:%M:%S UTC")"
COMMIT_MSG="docs(wiki): sync wiki documentation (${COMMIT_TIMESTAMP})"
git -C "${TEMP_DIR}" commit -m "${COMMIT_MSG}"
log_info "Created commit: ${COMMIT_MSG}"

# Push changes to remote
log_info "Pushing updates to ${WIKI_REMOTE}..."

# Determine target branch (GitHub wikis typically use 'master', but check current)
CURRENT_BRANCH="$(git -C "${TEMP_DIR}" rev-parse --abbrev-ref HEAD)"
if [[ -z "${CURRENT_BRANCH}" || "${CURRENT_BRANCH}" == "HEAD" ]]; then
  CURRENT_BRANCH="master"
fi

if git -C "${TEMP_DIR}" push origin "${CURRENT_BRANCH}"; then
  log_success "Wiki successfully synchronized and pushed to ${WIKI_REMOTE} (${CURRENT_BRANCH})!"
else
  log_error "Failed to push to ${WIKI_REMOTE}. Please verify permissions or initialize the wiki on GitHub first."
  exit 1
fi
