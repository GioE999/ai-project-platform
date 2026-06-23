import { describe, it, expect } from "vitest";
import { MarkdownParser, markdownParser } from "@/lib/services/markdown-parser";

describe("MarkdownParser", () => {
  describe("parse", () => {
    it("should extract wikilinks with correct positions", () => {
      const content = "This is a [[concept]] and [[another idea]] in text.";
      const result = markdownParser.parse(content, "Test Note");

      expect(result.wikilinks).toHaveLength(2);

      expect(result.wikilinks[0]).toEqual({
        raw: "[[concept]]",
        target: "concept",
        position: { start: 10, end: 21 },
      });

      expect(result.wikilinks[1]).toEqual({
        raw: "[[another idea]]",
        target: "another idea",
        position: { start: 26, end: 42 },
      });
    });

    it("should return empty wikilinks for content without links", () => {
      const content = "Just plain text without any links.";
      const result = markdownParser.parse(content, "Plain Note");

      expect(result.wikilinks).toHaveLength(0);
    });

    it("should calculate word count excluding wikilinks", () => {
      const content = "Hello world [[concept]] more words";
      const result = markdownParser.parse(content, "Test");

      // "Hello world  more words" -> 4 words
      expect(result.metadata.wordCount).toBe(4);
    });

    it("should calculate word count for empty content", () => {
      const result = markdownParser.parse("", "Empty");
      expect(result.metadata.wordCount).toBe(0);
    });

    it("should set metadata title correctly", () => {
      const result = markdownParser.parse("content", "My Title");
      expect(result.metadata.title).toBe("My Title");
    });

    it("should use 'Untitled' as default title", () => {
      const result = markdownParser.parse("content");
      expect(result.metadata.title).toBe("Untitled");
    });

    it("should preserve original content in AST", () => {
      const content = "Some [[link]] content";
      const result = markdownParser.parse(content, "Note");
      expect(result.content).toBe(content);
    });
  });

  describe("format", () => {
    it("should produce original content (round-trip)", () => {
      const content = "Hello [[world]] and [[universe]]!";
      const ast = markdownParser.parse(content, "Test");
      const formatted = markdownParser.format(ast);

      expect(formatted).toBe(content);
    });

    it("should round-trip content without wikilinks", () => {
      const content = "Plain text without special syntax.";
      const ast = markdownParser.parse(content, "Test");
      const formatted = markdownParser.format(ast);

      expect(formatted).toBe(content);
    });
  });

  describe("extractWikilinks", () => {
    it("should return unique targets", () => {
      const content = "Link to [[concept]] and again [[concept]] plus [[other]]";
      const targets = markdownParser.extractWikilinks(content);

      expect(targets).toEqual(["concept", "other"]);
    });

    it("should return empty array for content without wikilinks", () => {
      const targets = markdownParser.extractWikilinks("No links here");
      expect(targets).toEqual([]);
    });

    it("should handle wikilinks with special characters", () => {
      const content = "Link to [[machine learning]] and [[AI/ML]]";
      const targets = markdownParser.extractWikilinks(content);

      expect(targets).toEqual(["machine learning", "AI/ML"]);
    });

    it("should not match incomplete brackets", () => {
      const content = "Not a link [single] or [[incomplete";
      const targets = markdownParser.extractWikilinks(content);

      expect(targets).toEqual([]);
    });
  });
});
