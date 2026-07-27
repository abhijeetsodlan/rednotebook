export function readingTime(markdown: string) {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function excerptFromMarkdown(markdown: string, limit = 180) {
  const text = markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#>*_`[\]()!-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
}

export function headingsFromMarkdown(markdown: string) {
  return Array.from(markdown.matchAll(/^(#{2,3})\s+(.+)$/gm)).map((match) => {
    const text = match[2].replace(/[#`*_]/g, "").trim();
    return {
      depth: match[1].length,
      text,
      id: slugify(text)
    };
  });
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeTags(tags: unknown) {
  if (Array.isArray(tags)) return tags.map(String).map((tag) => tag.trim()).filter(Boolean);
  if (typeof tags === "string") {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return normalizeTags(parsed);
    } catch {
      // Plain comma-separated strings are the normal SQLite storage format.
    }
    return tags.split(",").map((tag) => tag.trim()).filter(Boolean);
  }
  return [];
}

export function serializeTags(tags: unknown) {
  return normalizeTags(tags).join(",");
}
