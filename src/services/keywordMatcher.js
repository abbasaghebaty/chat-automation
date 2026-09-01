import { automations } from "../config/automation.js";

/**
 * نرمال‌سازی متن فارسی برای کاهش تفاوت‌های تایپی.
 * علاوه بر حروف عربی/فارسی، نیم‌فاصله و punctuation هم یکدست می‌شوند.
 */
export function normalizeText(text) {
  return String(text)
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ى/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u200c\u200d]/g, " ")
    .replace(/[\u0640]/g, "")
    .replace(/[؟?!.,،؛:()[\]{}"'`«»]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * بررسی تطبیق keyword با رعایت مرز واژه.
 *
 * includes() قبلی باعث false positive می‌شد؛ مثلاً keyword عمومی "چند"
 * می‌توانست داخل کلمات نامرتبط هم match شود. با فاصله‌گذاری مصنوعی،
 * فقط خود عبارت یا یک عبارت کامل داخل متن match می‌شود.
 */
function containsKeyword(text, keyword) {
  const normalizedText = ` ${normalizeText(text)} `;
  const normalizedKeyword = normalizeText(keyword);

  if (!normalizedKeyword) {
    return false;
  }

  return normalizedText.includes(` ${normalizedKeyword} `);
}

/**
 * پیدا کردن automation با اولویت بالاتر.
 * نتیجه null یعنی هیچ rule فعالی با متن کاربر تطبیق نداشته است.
 */
export function findAutomation(text) {
  if (!String(text).trim()) {
    return null;
  }

  const enabledAutomations = automations
    .filter((automation) => automation.enabled)
    .sort((a, b) => b.priority - a.priority);

  for (const automation of enabledAutomations) {
    if (
      automation.keywords.some((keyword) => containsKeyword(text, keyword))
    ) {
      return automation;
    }
  }

  return null;
}
