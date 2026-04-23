export type ToolDefinition = {
  slug: string;
  name: string;
  description: string;
  badge: string;
};

export const tools: ToolDefinition[] = [
  {
    slug: "uuid",
    name: "UUID Generator",
    description: "Create v4 UUIDs instantly and copy a fresh batch for IDs, tests, and fixtures.",
    badge: "Identity",
  },
  {
    slug: "base64",
    name: "Base64 Encoder",
    description: "Encode or decode text with UTF-8 support without leaving the browser.",
    badge: "Encoding",
  },
  {
    slug: "calculator",
    name: "Calculator",
    description: "A quick arithmetic workspace with keyboard-friendly buttons and running evaluation.",
    badge: "Math",
  },
  {
    slug: "hex-calculator",
    name: "Hex Calculator",
    description: "Convert between decimal, hexadecimal, binary, and octal while keeping everything in sync.",
    badge: "Number Systems",
  },
];
