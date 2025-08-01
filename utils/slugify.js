// utils/slugify.js
export function generateSlugFromContent(title, categories, content) {
  const fullText = [
    title,
    ...(Array.isArray(categories) ? categories : []),
    ...content.map((block) => {
      if (typeof block.content === "string") return block.content;
      if (Array.isArray(block.content)) return block.content.join(" ");
      return "";
    }),
  ].join(" ");

  return fullText
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
