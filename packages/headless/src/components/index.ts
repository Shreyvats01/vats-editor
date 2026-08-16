export { useCurrentEditor as useEditor } from "@tiptap/react";
export type { Editor as EditorInstance } from "@tiptap/core";
export type { JSONContent } from "@tiptap/react";

export {
  EditorRoot,
  EditorContent,
  type EditorContentProps,
  type EditorRootProps,
  EditorStoreContext,
  useEditorStore,
} from "./editor";
export { EditorBubble, type EditorBubbleProps } from "./editor-bubble";
export { EditorBubbleItem } from "./editor-bubble-item";
export {
  EditorCommand,
  EditorCommandList,
  EditorCommandOut,
  type EditorCommandOutRef,
  type EditorCommandOutProps,
  EditorCommandTunnelContext,
} from "./editor-command";
export { EditorCommandItem, EditorCommandEmpty } from "./editor-command-item";