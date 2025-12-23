export const generateSlug = (text) => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")}-${random}`;
};
