import { Fragment, type Node } from "@tiptap/pm/model";
import type { EditorInstance } from "../components";

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (_e) {
    return false;
  }
}

export function getUrlFromString(str: string) {
  if (isValidUrl(str)) return str;
  try {
    if (str.includes(".") && !str.includes(" ")) {
      return new URL(`https://${str}`).toString();
    }
  } catch (_e) {
    return null;
  }
}

interface MarkdownSerializerLike {
  serialize(content: unknown): string;
}

interface MarkdownStorageLike {
  serializer?: MarkdownSerializerLike;
  getMarkdown?: () => string;
}

interface EditorWithMarkdown {
  storage?: {
    markdown?: MarkdownStorageLike;
  };
  markdown?: {
    serialize?: (json: unknown) => string;
  };
  getMarkdown?: () => string;
}

// Get the text before a given position in markdown format
export const getPrevText = (editor: EditorInstance, position: number): string => {
  const nodes: Node[] = [];
  editor.state.doc.forEach((node, pos) => {
    if (pos >= position) return false;
    nodes.push(node);
    return true;
  });
  const fragment = Fragment.fromArray(nodes);
  const doc = editor.state.doc.copy(fragment);

  const editorWithMarkdown = editor as unknown as EditorWithMarkdown;
  return (
    editorWithMarkdown.storage?.markdown?.serializer?.serialize(doc.content) ??
    editorWithMarkdown.markdown?.serialize?.(doc.toJSON()) ??
    ""
  );
};

// Get all content from the editor in markdown format
export const getAllContent = (editor: EditorInstance): string => {
  const editorWithMarkdown = editor as unknown as EditorWithMarkdown;
  return (
    editorWithMarkdown.storage?.markdown?.getMarkdown?.() ??
    editorWithMarkdown.getMarkdown?.() ??
    ""
  );
};

