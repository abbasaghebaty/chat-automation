import { automations } from "../config/automation.js";

/**
 * نرمال‌سازی متن فارسی.
 */
export function normalizeText(text) {
  return String(text ?? "")
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ى/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/ۀ/g, "ه")
    .replace(/ة/g, "ه")
    .replace(/[\u200c\u200d]/g, " ")
    .replace(/[\u0640]/g, "")
    .replace(/[؟?!.,،؛:()[\]{}"'`«»]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * حذف فاصله‌ها برای تشخیص کلمات چسبیده.
 */
function compact(text) {
  return normalizeText(text)
    .replace(/\s+/g, "");
}

/**
 * فاصله مجاز بر اساس طول کلمه.
 *
 * حداکثر:
 * ۲ خطای کاراکتری
 *
 * برای کلمات خیلی کوتاه،
 * تحمل کمتر می‌شود تا false positive زیاد نشود.
 */
/**
 * فاصله مجاز بر اساس طول کلمه.
 *
 * کلمات کوتاه نباید fuzzy matching آزاد داشته باشند
 * چون false positive زیادی تولید می‌کنند.
 *
 * مثال:
 *
 * دارین
 * دارای طول ۵ است و فقط یک خطای تایپی
 * برای آن پذیرفته می‌شود.
 */
function getTypoTolerance(length) {
  if (length <= 4) {
    return 0;
  }

  if (length <= 7) {
    return 1;
  }

  return 2;
}
