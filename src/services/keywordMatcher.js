import { automations } from "../config/automation.js";

export function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, " ")
    .trim();
}

export function findResponse(text) {
  const normalizedText = normalizeText(text);

  for (const automation of automations) {
    for (const keyword of automation.keywords) {
      const normalizedKeyword = normalizeText(keyword);

      if (normalizedText.includes(normalizedKeyword)) {
        return automation.response;
      }
    }
  }

  return null;
}
