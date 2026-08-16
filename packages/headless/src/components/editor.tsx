import { EditorProvider } from "@tiptap/react";
import type { EditorProviderProps, JSONContent } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import { createStore, Provider } from "jotai";
import { createContext, forwardRef, useContext, useRef } from "react";
import type { FC, ReactNode } from "react";
import tunnel from "tunnel-rat";
import { novelStore } from "../utils/store";
import {
  EditorCommandTunnelContext,
  editorStoreMap,
  editorTunnelMap,
} from "./editor-command";

export interface EditorProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export interface EditorRootProps {
  readonly children: ReactNode;
  readonly store?: ReturnType<typeof createStore>;
}

export const EditorStoreContext = createContext<ReturnType<typeof createStore> | undefined>(undefined);

export const useEditorStore = (): ReturnType<typeof createStore> => {
  const store = useContext(EditorStoreContext);
  return store ?? novelStore;
};

export const EditorRoot: FC<EditorRootProps> = ({ children, store }) => {
  const defaultStore = useRef(createStore()).current;
  const currentStore = store ?? defaultStore;
  const tunnelInstance = useRef(tunnel()).current;

  return (
    <EditorStoreContext.Provider value={currentStore}>
      <Provider store={currentStore}>
        <EditorCommandTunnelContext.Provider value={tunnelInstance}>
          {children}
        </EditorCommandTunnelContext.Provider>
      </Provider>
    </EditorStoreContext.Provider>
  );
};

export type EditorContentProps = Omit<EditorProviderProps, "content"> & {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly initialContent?: JSONContent;
};

export const EditorContent = forwardRef<HTMLDivElement, EditorContentProps>(
  ({ className, children, initialContent, ...rest }, ref) => {
    const store = useEditorStore();
    const tunnelInstance = useContext(EditorCommandTunnelContext);

    const onBeforeCreate = (props: { editor: Editor }) => {
      if (store) editorStoreMap.set(props.editor, store);
      if (tunnelInstance) editorTunnelMap.set(props.editor, tunnelInstance);
      rest.onBeforeCreate?.(props);
    };

    const onCreate = (props: { editor: Editor }) => {
      if (store) editorStoreMap.set(props.editor, store);
      if (tunnelInstance) editorTunnelMap.set(props.editor, tunnelInstance);
      rest.onCreate?.(props);
    };

    return (
      <div ref={ref} className={className}>
        <EditorProvider
          {...rest}
          onBeforeCreate={onBeforeCreate}
          onCreate={onCreate}
          content={initialContent}
        >
          {children}
        </EditorProvider>
      </div>
    );
  },
);

EditorContent.displayName = "EditorContent";

