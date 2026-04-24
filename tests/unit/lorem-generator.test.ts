import { describe, expect, it } from "vitest";
import {
  MAX_LOREM_COUNT,
  clampLoremCount,
  generateParagraphs,
  generateSentences,
  generateWords,
} from "../../lib/lorem-generator";

describe("lorem generator helpers", () => {
  it("clamps counts to the supported numeric input range", () => {
    expect(clampLoremCount(Number.NaN)).toBe(1);
    expect(clampLoremCount(0)).toBe(1);
    expect(clampLoremCount(7.9)).toBe(7);
    expect(clampLoremCount(MAX_LOREM_COUNT + 50)).toBe(MAX_LOREM_COUNT);
  });

  it("generates the requested number of lorem ipsum words", () => {
    expect(generateWords(5).split(/\s+/)).toHaveLength(5);
    expect(generateWords(5)).toMatch(/^lorem ipsum dolor sit amet$/i);
  });

  it("generates the requested number of sentences", () => {
    const sentences = generateSentences(4).split(/(?<=\.)\s+/);

    expect(sentences).toHaveLength(4);
    expect(sentences.every((sentence) => /^[A-Z]/.test(sentence) && sentence.endsWith("."))).toBe(true);
  });

  it("generates the requested number of paragraphs", () => {
    const paragraphs = generateParagraphs(3).split(/\n\n/);

    expect(paragraphs).toHaveLength(3);
    expect(paragraphs.every((paragraph) => paragraph.includes("."))).toBe(true);
  });
});
