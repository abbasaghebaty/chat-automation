import { automations } from "../config/automation.js";

/**
 * نرمال‌سازی متن فارسی برای کاهش تفاوت‌های تایپی.
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

function compact(text) {
  return normalizeText(text).replace(/\s+/g, "");
}

function tokenize(text) {
  const normalized = normalizeText(text);

  return normalized
    ? normalized.split(" ")
    : [];
}

function levenshteinDistance(a, b) {
  if (a === b) {
    return 0;
  }

  if (!a.length) {
    return b.length;
  }

  if (!b.length) {
    return a.length;
  }

  if (a.length < b.length) {
    [a, b] = [b, a];
  }

  let previous = Array.from(
    { length: b.length + 1 },
    (_, index) => index
  );

  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];

    for (let j = 1; j <= b.length; j += 1) {
      const cost =
        a[i - 1] === b[j - 1]
          ? 0
          : 1;

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
 * تعداد خطای قابل قبول بر اساس طول keyword فشرده‌شده.
 */
function getTypoTolerance(length) {
  if (length < 5) {
    return 0;
  }

  if (length < 8) {
    return 1;
  }

  return 2;
}

/**
 * تطبیق keyword:
 *
 * 1. تطبیق دقیق
 * 2. تطبیق با حذف فاصله
 * 3. fuzzy matching محدود روی چند توکن مجاور
 *
 * این ساختار باعث می‌شود:
 *
 * ساعت کاری
 * ساعتکاری
 * ساعکاری
 *
 * بتوانند به یک intent برسند،
 * بدون اینکه fuzzy روی کل جمله آزادانه اجرا شود.
 */
function containsKeyword(text, keyword) {
  const normalizedText = normalizeText(text);
  const normalizedKeyword = normalizeText(keyword);

  if (!normalizedText || !normalizedKeyword) {
    return false;
  }

  /**
   * تطبیق دقیق با مرز عبارت.
   */
  if (
    ` ${normalizedText} `.includes(
      ` ${normalizedKeyword} `
    )
  ) {
    return true;
  }

  /**
   * پوشش تایپ بدون فاصله:
   *
   * «ساعت کاری»
   * =>
   * «ساعتکاری»
   */
  const compactText = compact(normalizedText);
  const compactKeyword = compact(normalizedKeyword);

  if (compactText.includes(compactKeyword)) {
    return true;
  }

  const maxDistance = getTypoTolerance(
    compactKeyword.length
  );

  if (maxDistance === 0) {
    return false;
  }

  const textTokens = tokenize(normalizedText);
  const keywordTokens = tokenize(normalizedKeyword);

  if (
    !textTokens.length ||
    !keywordTokens.length
  ) {
    return false;
  }

  const targetTokenCount =
    keywordTokens.length;

  const minTokenCount = Math.max(
    1,
    targetTokenCount - 1
  );

  const maxTokenCount = Math.min(
    textTokens.length,
    targetTokenCount + 1
  );

  /**
   * فقط پنجره‌های نزدیک به تعداد کلمات keyword بررسی می‌شوند.
   *
   * این کار جلوی fuzzy matching آزاد روی کل متن را می‌گیرد.
   */
  for (
    let count = minTokenCount;
    count <= maxTokenCount;
    count += 1
  ) {
    for (
      let start = 0;
      start <= textTokens.length - count;
      start += 1
    ) {
      const candidate = textTokens
        .slice(start, start + count)
        .join("");

      if (
        levenshteinDistance(
          candidate,
          compactKeyword
        ) <= maxDistance
      ) {
        return true;
      }
    }
  }

  return false;
}

export function findAutomation(text) {
  if (!String(text ?? "").trim()) {
    return null;
  }

  const enabledAutomations =
    automations
      .filter(
        (automation) => automation.enabled
      )
      .sort(
        (a, b) => b.priority - a.priority
      );

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
