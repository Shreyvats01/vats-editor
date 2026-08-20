/**
 * Zero-dependency, memory-safe code formatting utilities for Vats Editor.
 */

export type CodeFormatterFn = (
  code: string,
  language?: string | null,
) => Promise<string> | string;

/**
 * Formats a JSON string with 2-space indentation.
 */
export const formatJson = (code: string): string => {
  try {
    const parsed = JSON.parse(code);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return code;
  }
};

/**
 * Formats JavaScript / TypeScript code with structured indentation.
 */
export const formatJavaScript = (code: string): string => {
  const lines = code.split("\n");
  let indentLevel = 0;
  const indentSize = 2;
  const result: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      result.push("");
      continue;
    }

    // Decrement indent for closing brackets
    const closingMatch = trimmed.match(/^[}\])]/);
    if (closingMatch && indentLevel > 0) {
      indentLevel--;
    }

    const currentIndent = " ".repeat(indentLevel * indentSize);
    result.push(`${currentIndent}${trimmed}`);

    // Increment indent for opening brackets at end of line (excluding inline blocks)
    const openBrackets = (trimmed.match(/[{[(]/g) || []).length;
    const closeBrackets = (trimmed.match(/[}\])]/g) || []).length;
    const netIndent = openBrackets - closeBrackets;

    if (netIndent > 0 && !closingMatch) {
      indentLevel += netIndent;
    } else if (netIndent > 0 && closingMatch) {
      indentLevel += netIndent;
    }
  }

  return result.join("\n");
};

/**
 * Formats HTML / XML markup with tag indentation.
 */
export const formatHtml = (code: string): string => {
  const tokens = code.replace(/>\s*</g, ">\n<").split("\n");
  let indentLevel = 0;
  const indentSize = 2;
  const result: string[] = [];
  const voidTags = new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
  ]);

  for (const token of tokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;

    const isClosing = /^<\//.test(trimmed);
    const isSelfClosing = /\/>$/.test(trimmed);
    const tagMatch = trimmed.match(/^<([a-zA-Z0-9-]+)/);
    const tagName = tagMatch?.[1] ? tagMatch[1].toLowerCase() : "";
    const isVoid = voidTags.has(tagName);

    if (isClosing && indentLevel > 0) {
      indentLevel--;
    }

    const currentIndent = " ".repeat(indentLevel * indentSize);
    result.push(`${currentIndent}${trimmed}`);

    if (!isClosing && !isSelfClosing && !isVoid && /^<[a-zA-Z0-9-]/.test(trimmed)) {
      indentLevel++;
    }
  }

  return result.join("\n");
};

/**
 * Formats CSS / SCSS rules with indentation.
 */
export const formatCss = (code: string): string => {
  const lines = code
    .replace(/\{/g, " {\n")
    .replace(/\}/g, "\n}\n")
    .replace(/;/g, ";\n")
    .split("\n");

  let indentLevel = 0;
  const indentSize = 2;
  const result: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed === "}" && indentLevel > 0) {
      indentLevel--;
    }

    const currentIndent = " ".repeat(indentLevel * indentSize);
    result.push(`${currentIndent}${trimmed}`);

    if (trimmed.endsWith("{")) {
      indentLevel++;
    }
  }

  return result.join("\n");
};

/**
 * Formats SQL queries with uppercase keywords and clause indentation.
 */
export const formatSql = (code: string): string => {
  const sqlKeywords = [
    "SELECT",
    "FROM",
    "WHERE",
    "JOIN",
    "LEFT JOIN",
    "RIGHT JOIN",
    "INNER JOIN",
    "OUTER JOIN",
    "ON",
    "GROUP BY",
    "HAVING",
    "ORDER BY",
    "LIMIT",
    "OFFSET",
    "INSERT INTO",
    "VALUES",
    "UPDATE",
    "SET",
    "DELETE FROM",
    "CREATE TABLE",
    "ALTER TABLE",
    "DROP TABLE",
  ];

  let formatted = code;

  // Capitalize common SQL keywords
  for (const kw of sqlKeywords) {
    const regex = new RegExp(`\\b${kw}\\b`, "gi");
    formatted = formatted.replace(regex, kw);
  }

  return formatted;
};

/**
 * Default built-in code formatting dispatcher based on language.
 */
export const defaultFormatCode: CodeFormatterFn = (
  code: string,
  language?: string | null,
): string => {
  if (!code || !code.trim()) return code;

  const lang = (language || "").toLowerCase().trim();

  switch (lang) {
    case "json":
      return formatJson(code);
    case "js":
    case "javascript":
    case "ts":
    case "typescript":
    case "jsx":
    case "tsx":
      return formatJavaScript(code);
    case "html":
    case "xml":
    case "svg":
      return formatHtml(code);
    case "css":
    case "scss":
    case "less":
      return formatCss(code);
    case "sql":
      return formatSql(code);
    case "py":
    case "python":
      // Normalize tab indentation to 4 spaces for Python
      return code.replace(/\t/g, "    ");
    default:
      // Default indentation cleanup
      return code;
  }
};
