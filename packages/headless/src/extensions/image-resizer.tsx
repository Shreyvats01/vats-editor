import { useCurrentEditor } from "@tiptap/react";
import type { FC } from "react";
import Moveable from "react-moveable";

export const ImageResizer: FC = () => {
  const { editor } = useCurrentEditor();

  if (!editor?.isActive("image")) return null;

  const updateMediaSize = () => {
    const imageInfo = document.querySelector(".ProseMirror-selectednode") as HTMLImageElement | null;
    if (imageInfo) {
      const selection = editor.state.selection;
      const setImage = editor.commands.setImage as (options: {
        src: string;
        width?: number | string | null;
        height?: number | string | null;
      }) => boolean;

      const parseDimension = (val: string | null | undefined): number | string | null => {
        if (!val) return null;
        const trimmed = val.trim();
        if (trimmed.endsWith("%")) {
          const num = Number.parseFloat(trimmed);
          return Number.isNaN(num) ? null : `${num}%`;
        }
        if (trimmed.endsWith("px")) {
          const num = Number.parseFloat(trimmed);
          return Number.isNaN(num) ? null : num;
        }
        const num = Number.parseFloat(trimmed);
        return Number.isNaN(num) ? null : num;
      };

      const width =
        parseDimension(imageInfo.style.width) ??
        parseDimension(imageInfo.getAttribute("width")) ??
        (imageInfo.width ? imageInfo.width : null);

      const height =
        parseDimension(imageInfo.style.height) ??
        parseDimension(imageInfo.getAttribute("height")) ??
        (imageInfo.height ? imageInfo.height : null);

      setImage({
        src: imageInfo.src,
        width,
        height,
      });
      editor.commands.setNodeSelection(selection.from);
    }
  };

  return (
    <Moveable
      target={document.querySelector(".ProseMirror-selectednode") as HTMLDivElement}
      container={null}
      origin={false}
      /* Resize event edges */
      edge={false}
      throttleDrag={0}
      /* When resize or scale, keeps a ratio of the width, height. */
      keepRatio={true}
      /* resizable*/
      /* Only one of resizable, scalable, warpable can be used. */
      resizable={true}
      throttleResize={0}
      /* Set the direction of resizable */
      renderDirections={["w", "e"]}
      onResize={({
        target,
        width,
        height,
        delta,
      }) => {
        if (delta[0]) target.style.width = `${width}px`;
        if (delta[1]) target.style.height = `${height}px`;
      }}
      onResizeEnd={() => {
        updateMediaSize();
      }}
    />
  );
};

