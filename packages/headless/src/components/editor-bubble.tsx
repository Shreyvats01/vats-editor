import { isNodeSelection, useCurrentEditor } from "@tiptap/react";
import { BubbleMenu, type BubbleMenuProps } from "@tiptap/react/menus";
import { forwardRef, useMemo } from "react";
import type { ReactNode } from "react";

export interface EditorBubbleProps extends Omit<BubbleMenuProps, "editor"> {
  readonly children: ReactNode;
}

export const EditorBubble = forwardRef<HTMLDivElement, EditorBubbleProps>(
  ({ children, options, shouldShow: customShouldShow, ...rest }, ref) => {
    const { editor: currentEditor } = useCurrentEditor();

    const defaultShouldShow = useMemo(() => {
      const fn: NonNullable<BubbleMenuProps["shouldShow"]> = ({ editor, state }) => {
        const { selection } = state;
        const { empty } = selection;

        // don't show bubble menu if:
        // - the editor is not editable
        // - the selected node is an image
        // - the selection is empty
        // - the selection is a node selection (for drag handles)
        if (!editor.isEditable || editor.isActive("image") || empty || isNodeSelection(selection)) {
          return false;
        }
        return true;
      };
      return fn;
    }, []);

    const shouldShow = customShouldShow ?? defaultShouldShow;

    if (!currentEditor) return null;

    return (
      // We need to add this because of https://github.com/ueberdosis/tiptap/issues/2658
      <div ref={ref}>
        <BubbleMenu
          editor={currentEditor}
          shouldShow={shouldShow}
          options={options}
          {...rest}
        >
          {children}
        </BubbleMenu>
      </div>
    );
  },
);

EditorBubble.displayName = "EditorBubble";

export default EditorBubble;

