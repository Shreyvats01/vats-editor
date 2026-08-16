# ADR-002: Isolated Store and Event Architecture

## Status
Accepted

## Date
2026-08-16

## Context
Vats Editor uses Jotai atoms to manage transient editor state, including the active slash command query, suggestion range, and selection coordinates. 

In early versions, the editor relied on a single module-level Jotai store instance (`novelStore`). When developers mounted multiple editor instances on the same page (such as side-by-side markdown comparisons, split-screen note editors, or threaded comments), this singleton store caused cross-editor state collisions:

1. Typing a slash command in one editor updated `queryAtom` and `rangeAtom` in all other editor instances simultaneously.
2. Global `window.addEventListener("keydown", ...)` listeners attached inside suggestion components intercepted `ArrowUp`, `ArrowDown`, and `Enter` key presses meant for other inputs or unrelated editors on the screen.
3. Unmounting one editor instance could reset or leave stale atoms in the shared store, breaking suggestion popups in remaining active editors.

The editor required an architecture that isolates state and keyboard event handling to each individual editor root while allowing portal-based UI rendering without leaking memory.

## Decision
We implemented a two-part isolation architecture: per-root Jotai store scoping and imperative event dispatching via React refs.

### 1. Per-EditorRoot Store Scoping
We updated `EditorRoot` to create a dedicated Jotai store per component instance using `useRef(createStore()).current`. The instance is distributed down the tree through `EditorStoreContext` and Jotai's `<Provider store={currentStore}>`.

To connect ProseMirror editor lifecycles with React contexts without memory leaks, we maintain a `WeakMap<Editor, ReturnType<typeof createStore>>` (`editorStoreMap`). During editor creation in `EditorContent` (`onBeforeCreate` and `onCreate`), the editor instance is mapped to its active store. Custom extensions and hooks retrieve their isolated store via `useEditorStore()` or `editorStoreMap.get(editor)`.

Consumers can also pass an explicit external store via `<EditorRoot store={customStore}>` if they intentionally want to share state across specific editor instances.

### 2. Imperative Ref Event Dispatching
We eliminated global window keyboard listeners. `EditorCommandOut` now exposes an `onKeyDown` method through `useImperativeHandle`.

When a suggestion plugin captures navigation keys (`ArrowUp`, `ArrowDown`, `Enter`), it delegates the event directly to `EditorCommandOutRef.onKeyDown`. The handler locates the scoped `[data-slash-command]` or `[cmdk-root]` container and dispatches a synthetic `KeyboardEvent` directly to that element. This confines key handling strictly to the active editor command list.

### 3. Isolated Tunnels
To render floating command menus across DOM portals while preserving React context, we create a scoped `tunnel-rat` instance per `EditorRoot` using `useRef(tunnel()).current` and track it in `editorTunnelMap`.

## Alternatives Considered

### Pure Props Drilling
Passing state and event callbacks down through component props would avoid external stores entirely. However, ProseMirror plugins and extension lifecycle hooks operate outside the React component tree. Direct prop drilling would require complex callback threading and mutable bridge objects across every extension.

### Global Zustand Store with Editor IDs
Using a single global Zustand store that indexes state by unique editor IDs (`Record<string, EditorState>`). This was rejected because managing manual cleanup in `useEffect` return functions is error prone. If a component unmounts unexpectedly, leftover IDs cause memory leaks. The `WeakMap` approach ensures automatic garbage collection when the editor instance is destroyed.

### Custom Window Event Emitter
Dispatching custom DOM events on `window` (such as `novel:command-keydown`). This was rejected because global event buses still require manual filtering logic by editor ID and fail to prevent race conditions during rapid keyboard navigation.

## Consequences

### Positive
- Multiple `EditorRoot` components run on the same page with complete isolation and zero cross-talk.
- Automatic memory management: garbage collection cleans up `WeakMap` entries when editor instances are destroyed.
- Keyboard navigation events for slash commands trigger only within the targeted editor instance.
- Backward compatibility: single-editor applications continue to work without changing their markup.

### Negative
- UI components that need access to editor state must reside inside an `EditorRoot` provider.
- Extension authors must access atoms using the scoped store reference (`useSetAtom(atom, { store })`) rather than relying on default global atom setters.
