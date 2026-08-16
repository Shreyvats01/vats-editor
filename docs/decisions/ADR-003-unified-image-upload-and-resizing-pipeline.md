# ADR-003: Unified Image Upload and Resizing Pipeline

## Status
Accepted

## Date
2026-08-16

## Context
Image handling in early versions of Vats Editor suffered from two major defects:

1. **Schema Collision and Extension Shadowing:** The base `@tiptap/extension-image` extension and a custom `UpdatedImage` extension (which added support for width and height dimensions) both declared the node name `"image"`. Registering both extensions caused the secondary extension to overwrite schema attributes, which silently stripped the ProseMirror decoration hooks required by `UploadImagesPlugin`. As a result, drag-and-drop and clipboard paste uploads failed or dropped image attributes upon insertion.
2. **Stale Transaction Race Condition in Asynchronous Uploads:** In `UploadImagesPlugin`, reading dropped or pasted image files used `FileReader.readAsDataURL()`. The callback captured `view.state.tr` from the initial event invocation. If the user continued typing or navigating before `reader.onload` or the remote upload promise resolved, applying the captured stale transaction reverted all intervening user edits and corrupted document position offsets (`pos`).
3. **Loss of Image Dimensions on Markdown Serialization:** Resized images that applied inline style attributes (such as `style="width: 300px"`) lost their custom dimensions when serialized to markdown or re-parsed into HTML, because the parser only inspected HTML `width` attributes and ignored inline CSS.

## Decision
We established a unified image schema and upload pipeline with the following components:

### 1. Unified `UpdatedImage` Extension Schema
We created a single custom image extension (`UpdatedImage`) that extends `@tiptap/extension-image` and replaces the default image node in the extension array. It registers `width` and `height` attributes with flexible parsers that inspect both HTML attributes and inline CSS styles:

```typescript
width: {
  default: null,
  parseHTML: (element) => element.getAttribute("width") || element.style.width || null,
  renderHTML: (attributes) => attributes.width ? { width: attributes.width } : {},
}
```

### 2. Transaction Safety with Dynamic Position Lookups
To eliminate stale transaction overwrite bugs in `UploadImagesPlugin`:
- Every asynchronous stage creates a new transaction from the current editor state (`view.state.tr`) rather than reusing a closed transaction object.
- Uploads generate a unique object reference token (`const id = {}`) assigned to the temporary `Decoration.widget`.
- When the upload promise resolves or fails, the plugin calls `findPlaceholder(view.state, id)` to resolve the current position dynamically. If surrounding text was deleted or moved during upload, the plugin calculates the accurate target offset without corrupting subsequent text.

### 3. Interactive Resizing with `ImageResizer`
We integrated `react-moveable` in the `ImageResizer` component. When an image node is selected (`.ProseMirror-selectednode`), the resizer displays directional handles (`renderDirections: ["w", "e"]`). On resize completion (`onResizeEnd`), dimensions are applied through `editor.commands.setImage({ src, width, height })` followed by `editor.commands.setNodeSelection(selection.from)`, committing the change directly to the ProseMirror history stack.

## Alternatives Considered

### Base64-Only Embedding
Storing raw base64 data strings directly in the ProseMirror document JSON without an asynchronous upload pipeline. This was rejected because large base64 strings inflate document payload size, slow down serialization, degrade editor performance, and prevent the use of image CDNs.

### Modal-Only Upload Dialog
Requiring users to click a toolbar button and submit a modal dialog with image URLs or file uploads. This was rejected because modern rich text editing expectations require frictionless drag-and-drop from the desktop and direct clipboard paste into the document flow.

### Separate Upload Widget Node
Creating a dedicated block node type for uploading states (such as `imageUploadPlaceholder`) and replacing the node with an `image` node on completion. This was rejected because mutating node types creates unnecessary transaction churn in the undo/redo history compared to ProseMirror decoration widgets, which exist purely in the view layer without dirtying document history.

## Consequences

### Positive
- Drag-and-drop and clipboard paste upload images with temporary preview placeholders while preserving user edits during upload.
- Dimensions set by visual resizing persist across HTML parsing, markdown export, and page reloads.
- No schema naming collisions between base Tiptap extensions and custom node extensions.
- Node selection remains synchronized with the ProseMirror document model after resizing.

### Negative
- `react-moveable` increases the client bundle size for the UI extension layer.
- Resizing requires the image node to be explicitly selected, which requires clicking the image rather than resizing on hover.
