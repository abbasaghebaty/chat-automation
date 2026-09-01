import { automations } from "../config/automation.js";

export function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ى/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function findAutomation(text) {
  const normalizedText = normalizeText(text);

  const enabledAutomations = automations
    .filter((automation) => automation.enabled)
    .sort((a, b) => b.priority - a.priority);

  for (const automation of enabledAutomations) {
    for (const keyword of automation.keywords) {
      const normalizedKeyword = normalizeText(keyword);

      if (normalizedText.includes(normalizedKeyword)) {
        return automation;
      }
    }
  }

  return null;
}
