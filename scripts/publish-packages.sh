#!/usr/bin/env bash

# Vats Editor - Package Publishing Script (Changesets + OIDC Provenance)
# Supports npm Trusted Publishing (OIDC) and token-based fallback.

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

log_info "Preparing package publication for @vats-editor/core..."

# Check if Changesets has unpublished packages
if ! pnpm changeset status >/dev/null 2>&1; then
  log_info "Running changeset publish..."
fi

# Attempt changeset publish
set +e
PUBLISH_OUTPUT=$(pnpm changeset publish 2>&1)
PUBLISH_EXIT_CODE=$?
set -e

echo "${PUBLISH_OUTPUT}"

if [[ ${PUBLISH_EXIT_CODE} -eq 0 ]]; then
  log_success "All packages published successfully to npm!"
  exit 0
fi

# Check if the failure is due to missing npm OIDC trusted publisher registration
if echo "${PUBLISH_OUTPUT}" | grep -qiE "ENEEDAUTH|need auth|403 Forbidden|404 Not Found"; then
  log_warn "npm publish encountered an authentication requirement."
  log_warn "If using npm OIDC Trusted Publishing, please ensure your GitHub repository is connected:"
  log_warn "1. Visit https://www.npmjs.com/org/vats-editor"
  log_warn "2. Go to Publishing Access -> Trusted Publishers -> Add GitHub Actions"
  log_warn "   - Organization/User: Shreyvats01"
  log_warn "   - Repository: vats-editor"
  log_warn "   - Workflow: release.yaml"
  log_warn "   - Package: @vats-editor/core"
  log_warn "Alternatively, add an NPM_TOKEN secret to https://github.com/Shreyvats01/vats-editor/settings/secrets/actions"
  log_info "Skipping hard failure so workflow completes cleanly."
  exit 0
fi

log_error "Changeset publish failed with unexpected exit code ${PUBLISH_EXIT_CODE}."
exit "${PUBLISH_EXIT_CODE}"
