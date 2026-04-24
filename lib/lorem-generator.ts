export const MAX_LOREM_COUNT = 1000;

const sourceWords = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "enim",
  "ad",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
  "duis",
  "aute",
  "irure",
  "in",
  "reprehenderit",
  "voluptate",
  "velit",
  "esse",
  "cillum",
  "fugiat",
  "nulla",
  "pariatur",
  "excepteur",
  "sint",
  "occaecat",
  "cupidatat",
  "non",
  "proident",
  "sunt",
  "culpa",
  "officia",
  "deserunt",
  "mollit",
  "anim",
  "id",
  "est",
  "laborum",
] as const;

function capitalize(word: string) {
  return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
}

function generateSentence(index: number) {
  const length = 8 + (index % 7);
  const start = (index * 11) % sourceWords.length;
  const words = Array.from({ length }, (_, offset) => sourceWords[(start + offset) % sourceWords.length]);
  return `${capitalize(words[0])} ${words.slice(1).join(" ")}.`;
}

export function clampLoremCount(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.min(MAX_LOREM_COUNT, Math.max(1, Math.trunc(value)));
}

export function generateWords(count: number) {
  return Array.from({ length: clampLoremCount(count) }, (_, index) => sourceWords[index % sourceWords.length]).join(" ");
}

export function generateSentences(count: number) {
  return Array.from({ length: clampLoremCount(count) }, (_, index) => generateSentence(index)).join(" ");
}

export function generateParagraphs(count: number) {
  return Array.from({ length: clampLoremCount(count) }, (_, index) => {
    const sentenceCount = 3 + (index % 3);
    return Array.from({ length: sentenceCount }, (_, offset) => generateSentence(index * 5 + offset)).join(" ");
  }).join("\n\n");
}
