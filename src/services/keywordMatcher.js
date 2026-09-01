```js
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

function compact(text) {
  return normalizeText(text).replace(/\s+/g, "");
}

function levenshteinDistance(a, b) {
  if (a === b) return 0;

  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  if (a.length < b.length) {
    [a, b] = [b, a];
  }

  let previous = Array.from(
    { length: b.length + 1 },
    (_, i) => i
  );

  for (let i = 1; i <= a.length; i++) {
    const current = [i];

    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + cost
      );
    }

    previous = current;
  }

  return previous[b.length];
}

/**
 * میزان غلط تایپی قابل قبول.
 * کلمات خیلی کوتاه fuzzy نمی‌شوند تا false positive کم بماند.
 */
function getTypoTolerance(length) {
  if (length < 5) return 0;
  if (length < 8) return 1;
  return 2;
}

function fuzzyContainsKeyword(text, keyword) {
  const normalizedText = compact(text);
  const normalizedKeyword = compact(keyword);

  const maxDistance = getTypoTolerance(normalizedKeyword.length);

  if (!normalizedKeyword || maxDistance === 0) {
    return false;
  }

  const minLength = Math.max(
    1,
    normalizedKeyword.length - maxDistance
  );

  const maxLength = Math.min(
    normalizedText.length,
    normalizedKeyword.length + maxDistance
  );

  for (
    let windowLength = minLength;
    windowLength <= maxLength;
    windowLength++
  ) {
    for (
      let start = 0;
      start <= normalizedText.length - windowLength;
      start++
    ) {
      const candidate = normalizedText.slice(
        start,
        start + windowLength
      );

      if (
        levenshteinDistance(candidate, normalizedKeyword) <=
        maxDistance
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * ابتدا تطبیق دقیق انجام می‌شود.
 * اگر تطبیق دقیق نبود، غلط تایپی محدود بررسی می‌شود.
 */
function containsKeyword(text, keyword) {
  const normalizedText = ` ${normalizeText(text)} `;
  const normalizedKeyword = normalizeText(keyword);

  if (!normalizedKeyword) {
    return false;
  }

  if (normalizedText.includes(` ${normalizedKeyword} `)) {
    return true;
  }

  return fuzzyContainsKeyword(normalizedText, normalizedKeyword);
}

/**
 * پیدا کردن automation با اولویت بالاتر.
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
      automation.keywords.some((keyword) =>
        containsKeyword(text, keyword)
      )
    ) {
      return automation;
    }
  }

  return null;
}
```
