import type { NoteAST, WikilinkNode, NoteMetadata } from "@/types/notes";

/**
 * MarkdownParser handles parsing and formatting of Markdown content
 * with Wikilink ([[concept]]) detection and extraction.
 */
export class MarkdownParser {
  /**
   * Parse markdown content to extract wikilinks and metadata.
   * Detects [[concept]] syntax and records positions.
   */
  parse(markdown: string, title: string = "Untitled"): NoteAST {
    const wikilinks: WikilinkNode[] = [];
    const regex = /\[\[([^\]]+)\]\]/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(markdown)) !== null) {
      wikilinks.push({
        raw: match[0],
        target: match[1],
        position: {
          start: match.index,
          end: match.index + match[0].length,
        },
      });
    }

    const wordCount = markdown
      .replace(/\[\[[^\]]+\]\]/g, "")
      .split(/\s+/)
      .filter(Boolean).length;

    return {
      content: markdown,
      wikilinks,
      metadata: { title, wordCount },
    };
  }

  /**
   * Format a NoteAST back to valid Markdown string.
   * Since we keep the original content intact, this is straightforward.
   */
  format(ast: NoteAST): string {
    return ast.content;
  }

  /**
   * Extract just the wikilink targets from markdown content.
   * Returns unique list of linked concepts.
   */
  extractWikilinks(content: string): string[] {
    const targets: string[] = [];
    const regex = /\[\[([^\]]+)\]\]/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      if (!targets.includes(match[1])) {
        targets.push(match[1]);
      }
    }

    return targets;
  }
}

/** Singleton instance for use across the application */
export const markdownParser = new MarkdownParser();
