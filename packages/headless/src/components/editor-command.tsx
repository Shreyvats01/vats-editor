import { useAtom, useSetAtom, type createStore } from "jotai";
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
} from "react";
import { Command } from "cmdk";
import { queryAtom, rangeAtom } from "../utils/atoms";
import { novelStore } from "../utils/store";
import tunnel from "tunnel-rat";
import type { ComponentPropsWithoutRef } from "react";
import type { Editor, Range } from "@tiptap/core";
import { useCurrentEditor } from "@tiptap/react";

export const editorStoreMap = new WeakMap<Editor, ReturnType<typeof createStore>>();
export const editorTunnelMap = new WeakMap<Editor, ReturnType<typeof tunnel>>();

const defaultTunnel = tunnel();
export const EditorCommandTunnelContext = createContext<ReturnType<typeof tunnel>>(defaultTunnel);

export interface EditorCommandOutProps {
  readonly query: string;
  readonly range: Range;
  readonly editor?: Editor;
}

export interface EditorCommandOutRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export const EditorCommandOut = forwardRef<EditorCommandOutRef, EditorCommandOutProps>(
  ({ query, range, editor: propsEditor }, ref) => {
    const { editor: currentEditor } = useCurrentEditor();
    const editor = propsEditor ?? currentEditor;
    const contextTunnel = useContext(EditorCommandTunnelContext);
    const tunnelInstance = (editor ? editorTunnelMap.get(editor) : null) ?? contextTunnel;
    const store = (editor ? editorStoreMap.get(editor) : null) ?? novelStore;

    const setQuery = useSetAtom(queryAtom, { store });
    const setRange = useSetAtom(rangeAtom, { store });

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setQuery(query);
    }, [query, setQuery]);

    useEffect(() => {
      setRange(range);
    }, [range, setRange]);

    useImperativeHandle(
      ref,
      () => ({
        onKeyDown: ({ event }: { event: KeyboardEvent }) => {
          const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];
          if (navigationKeys.includes(event.key)) {
            const commandElement =
              containerRef.current?.querySelector<HTMLElement>("[data-slash-command], [cmdk-root]") ??
              (containerRef.current?.firstElementChild as HTMLElement | null) ??
              containerRef.current;

            if (commandElement) {
              const syntheticEvent = new KeyboardEvent("keydown", {
                key: event.key,
                code: event.code,
                keyCode: event.keyCode,
                which: event.which,
                bubbles: true,
                cancelable: true,
              });
              commandElement.dispatchEvent(syntheticEvent);
              return true;
            }
          }
          return false;
        },
      }),
      [],
    );

    return (
      <div ref={containerRef}>
        {tunnelInstance?.Out ? <tunnelInstance.Out /> : null}
      </div>
    );
  },
);

EditorCommandOut.displayName = "EditorCommandOut";

export const EditorCommand = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof Command>>(
  ({ children, className, id, ...rest }, ref) => {
    const [query, setQuery] = useAtom(queryAtom);
    const generatedId = useId();
    const commandId = id ?? `slash-command-${generatedId}`;

    return (
      <EditorCommandTunnelContext.Consumer>
        {(tunnelInstance) => (
          <tunnelInstance.In>
            <Command
              ref={ref}
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
              id={commandId}
              data-slash-command=""
              className={className}
              {...rest}
            >
              <Command.Input value={query} onValueChange={setQuery} style={{ display: "none" }} />
              {children}
            </Command>
          </tunnelInstance.In>
        )}
      </EditorCommandTunnelContext.Consumer>
    );
  },
);

export const EditorCommandList = Command.List;

EditorCommand.displayName = "EditorCommand";

