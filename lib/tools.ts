export type ToolDefinition = {
  slug: string;
  name: string;
  description: string;
  badge: string;
  category: string;
};

export const tools: ToolDefinition[] = [
  { slug: "uuid", name: "UUID Generator", description: "Create v4 UUIDs instantly and copy a fresh batch for IDs, tests, and fixtures.", badge: "Identity", category: "Identity" },
  { slug: "base64", name: "Base64 Encoder", description: "Encode or decode text with UTF-8 support without leaving the browser.", badge: "Encoding", category: "Encoding" },
  { slug: "calculator", name: "Calculator", description: "A quick arithmetic workspace with keyboard-friendly buttons and running evaluation.", badge: "Math", category: "Math" },
  { slug: "hex-calculator", name: "Hex Calculator", description: "Convert between decimal, hexadecimal, binary, and octal while keeping everything in sync.", badge: "Number Systems", category: "Math" },
  { slug: "json-formatter", name: "JSON Formatter", description: "Validate, prettify, and minify JSON with clear error feedback for malformed input.", badge: "Data", category: "Data" },
  { slug: "json-diff", name: "JSON Diff", description: "Compare two JSON documents side by side and quickly spot structural or value changes.", badge: "Data", category: "Data" },
  { slug: "json-to-typescript", name: "JSON to TypeScript", description: "Turn sample JSON into a fast starter TypeScript type definition.", badge: "Data", category: "Data" },
  { slug: "url-encoder", name: "URL Encoder", description: "Encode and decode URLs, query strings, and reserved characters for safer sharing.", badge: "Encoding", category: "Encoding" },
  { slug: "url-parser", name: "URL Parser", description: "Break down a URL into protocol, host, path, parameters, and fragment parts instantly.", badge: "Encoding", category: "Encoding" },
  { slug: "query-param-editor", name: "Query Param Editor", description: "Build and edit URLs with query parameters without hand-editing long strings.", badge: "Encoding", category: "Encoding" },
  { slug: "timestamp-converter", name: "Timestamp Converter", description: "Move between Unix timestamps and readable dates with UTC and local time views.", badge: "Time", category: "Data" },
  { slug: "cron-parser", name: "Cron Parser", description: "Read a cron expression field by field so schedules become easier to verify.", badge: "Time", category: "Data" },
  { slug: "hash-generator", name: "Hash Generator", description: "Generate SHA hashes in the browser for quick integrity checks and comparisons.", badge: "Identity", category: "Security" },
  { slug: "jwt-decoder", name: "JWT Decoder", description: "Inspect JWT headers and payloads locally, with readable expiry and issue times.", badge: "Security", category: "Security" },
  { slug: "case-converter", name: "Case Converter", description: "Flip text between camelCase, PascalCase, snake_case, kebab-case, and more.", badge: "Text", category: "Text" },
  { slug: "regex-tester", name: "Regex Tester", description: "Test expressions against sample text, review flags, and inspect captured matches.", badge: "Text", category: "Text" },
  { slug: "html-entities", name: "HTML Entity Tool", description: "Encode text into HTML entities or decode escaped markup back into readable text.", badge: "Encoding", category: "Encoding" },
  { slug: "text-diff", name: "Text Diff", description: "Compare two blocks of text line by line and spot changed, added, or removed content.", badge: "Text", category: "Text" },
  { slug: "lorem-generator", name: "Lorem Generator", description: "Generate placeholder paragraphs, sentences, and words for UI mocks and demos.", badge: "Content", category: "Content" },
  { slug: "http-status", name: "HTTP Status Lookup", description: "Search common HTTP response codes and read what they mean in practice.", badge: "Reference", category: "Reference" },
  { slug: "mime-lookup", name: "MIME Lookup", description: "Look up common file extensions and MIME types for headers, uploads, and assets.", badge: "Reference", category: "Reference" },
  { slug: "color-converter", name: "Color Converter", description: "Convert hex colors into RGB and HSL with a live swatch preview.", badge: "Design", category: "Design" },
  { slug: "color-contrast", name: "Color Contrast Checker", description: "Check foreground and background combinations against WCAG contrast thresholds.", badge: "Design", category: "Design" }
];
