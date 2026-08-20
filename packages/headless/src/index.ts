// Components
export {
  EditorRoot,
  type EditorRootProps,
  EditorContent,
  type EditorContentProps,
  EditorStoreContext,
  useEditorStore,
  EditorBubble,
  type EditorBubbleProps,
  EditorBubbleItem,
  EditorCommand,
  EditorCommandList,
  EditorCommandItem,
  EditorCommandEmpty,
  useEditor,
  type EditorInstance,
  type JSONContent,
  CodeBlockView,
  type CodeBlockViewProps,
} from "./components";

// Extensions
export {
  CodeBlock,
  CodeBlockLowlight,
  DEFAULT_LANGUAGES,
  THEME_PRESETS,
  HorizontalRule,
  ImageResizer,
  InputRule,
  Placeholder,
  StarterKit,
  TaskItem,
  TaskList,
  TiptapImage,
  TiptapUnderline,
  MarkdownExtension,
  TextStyle,
  Color,
  HighlightExtension,
  CustomKeymap,
  TiptapLink,
  UpdatedImage,
  Youtube,
  Twitter,
  Mathematics,
  CharacterCount,
  GlobalDragHandle,
  Command,
  renderItems,
  createSuggestionItems,
  handleCommandNavigation,
  type SuggestionItem,
  type TwitterOptions,
  type MathematicsOptions,
  type CodeBlockOptions,
  type CodeLanguage,
  type CodeTheme,
  ReactNodeViewRenderer,
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewProps,
} from "./extensions";

// Plugins
export {
  UploadImagesPlugin,
  type UploadFn,
  type ImageUploadOptions,
  createImageUpload,
  handleImageDrop,
  handleImagePaste,
} from "./plugins";

// Utils
export {
  isValidUrl,
  getUrlFromString,
  getPrevText,
  getAllContent,
  type CodeFormatterFn,
  formatJson,
  formatJavaScript,
  formatHtml,
  formatCss,
  formatSql,
  defaultFormatCode,
} from "./utils";

// Store and Atoms
export { queryAtom, rangeAtom } from "./utils/atoms";
export { vatsStore, novelStore } from "./utils/store";
