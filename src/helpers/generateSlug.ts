export const generateSlug = (text: string) => {
  return text
    .trim()
    .replaceAll("  ", " ")
    .replaceAll(" ", "-")
    .replaceAll("%", "")
    .normalize("NFD")
    .replaceAll(/\p{Diacritic}/gu, "");
};
