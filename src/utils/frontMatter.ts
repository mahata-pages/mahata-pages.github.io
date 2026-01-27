import { parse } from "yaml";

export interface FrontMatter {
  title?: string;
  date?: string;
  [key: string]: unknown;
}

/**
 * Regex pattern to match front matter YAML block
 */
const FRONT_MATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---/;

/**
 * Extracts and parses front matter from markdown content
 * @param content - The markdown content with front matter
 * @returns Parsed front matter object or null if no front matter found
 * @throws Error if front matter exists but YAML parsing fails
 */
export function extractFrontMatter(content: string): FrontMatter | null {
  const frontMatterMatch = FRONT_MATTER_REGEX.exec(content);

  if (!frontMatterMatch) {
    return null;
  }

  // Let YAML parsing errors propagate to be caught by caller
  return parse(frontMatterMatch[1]) as FrontMatter;
}

/**
 * Extracts the content after front matter
 * @param content - The markdown content with front matter
 * @returns The content after front matter, trimmed
 */
export function extractContentAfterFrontMatter(content: string): string {
  const frontMatterMatch = FRONT_MATTER_REGEX.exec(content);

  if (!frontMatterMatch) {
    return content;
  }

  const contentStart = frontMatterMatch[0].length;
  return content.substring(contentStart).trim();
}

/**
 * Validates that front matter has required fields
 * @param frontMatter - The parsed front matter object
 * @returns true if valid (has title and date), false otherwise
 */
export function isValidFrontMatter(
  frontMatter: FrontMatter | null,
): frontMatter is Required<Pick<FrontMatter, "title" | "date">> {
  return (
    frontMatter !== null &&
    typeof frontMatter.title === "string" &&
    frontMatter.title.length > 0 &&
    typeof frontMatter.date === "string" &&
    frontMatter.date.length > 0
  );
}
