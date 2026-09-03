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
function getTypoTolerance(length) {
  if (length <= 2) {
    return 0;
  }

  if (length === 3) {
    return 1;
  }

  return Math.min(
    2,
    Math.floor(length / 2)
  );
}

/**
 * محاسبه فاصله Levenshtein.
 */
function levenshteinDistance(
  a,
  b
) {
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
    {
      length:
        b.length + 1
    },
    (_, index) =>
      index
  );

  for (
    let i = 1;
    i <= a.length;
    i += 1
  ) {
    const current = [i];

    for (
      let j = 1;
      j <= b.length;
      j += 1
    ) {
      const cost =
        a[i - 1] ===
        b[j - 1]
          ? 0
          : 1;

      current[j] =
        Math.min(
          current[j - 1] + 1,
          previous[j] + 1,
          previous[j - 1] +
            cost
        );
    }

    previous = current;
  }

  return previous[b.length];
}

/**
 * بررسی fuzzy substring.
 *
 * تفاوت مهم با نسخه قبلی:
 *
 * دیگر لازم نیست keyword یک کلمه
 * یا یک token مستقل باشد.
 *
 * مثال:
 *
 * keyword:
 * دارین
 *
 * text:
 * شامپوهمذارین
 *
 * بخش:
 * ذارین
 *
 * با فاصله ۱ پذیرفته می‌شود.
 */
function fuzzyContains(
  text,
  keyword
) {
  const compactText =
    compact(text);

  const compactKeyword =
    compact(keyword);

  if (
    !compactText ||
    !compactKeyword
  ) {
    return false;
  }

  const keywordLength =
    compactKeyword.length;

  const maxDistance =
    getTypoTolerance(
      keywordLength
    );

  if (maxDistance === 0) {
    return false;
  }

  const minLength =
    Math.max(
      1,
      keywordLength -
        maxDistance
    );

  const maxLength =
    keywordLength +
    maxDistance;

  /**
   * همه substringهای نزدیک به
   * طول keyword بررسی می‌شوند.
   */
  for (
    let length = minLength;
    length <= maxLength;
    length += 1
  ) {
    if (
      length >
      compactText.length
    ) {
      continue;
    }

    for (
      let start = 0;
      start <=
        compactText.length -
          length;
      start += 1
    ) {
      const candidate =
        compactText.slice(
          start,
          start + length
        );

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

/**
 * بررسی وجود keyword در متن.
 *
 * ترتیب:
 *
 * 1. تطبیق مستقیم
 * 2. تطبیق بدون فاصله
 * 3. fuzzy matching با حداکثر ۲ خطا
 */
function containsKeyword(
  text,
  keyword
) {
  const normalizedText =
    normalizeText(text);

  const normalizedKeyword =
    normalizeText(keyword);

  if (
    !normalizedText ||
    !normalizedKeyword
  ) {
    return false;
  }

  /**
   * تطبیق مستقیم.
   *
   * عمدی است که boundary لازم نیست.
   *
   * بنابراین:
   *
   * دارین
   * داخل
   * شامپوهمدارین
   *
   * نیز پیدا می‌شود.
   */
  if (
    normalizedText.includes(
      normalizedKeyword
    )
  ) {
    return true;
  }

  /**
   * تطبیق بدون فاصله.
   *
   * مثال:
   *
   * ساعت کاری
   * ساعتکاری
   */
  const compactText =
    compact(normalizedText);

  const compactKeyword =
    compact(normalizedKeyword);

  if (
    compactText.includes(
      compactKeyword
    )
  ) {
    return true;
  }

  return fuzzyContains(
    normalizedText,
    normalizedKeyword
  );
}

/**
 * بررسی یک لیست keyword.
 */
function matchesKeywordList(
  text,
  keywords
) {
  if (
    !Array.isArray(
      keywords
    )
  ) {
    return false;
  }

  return keywords.some(
    (keyword) =>
      containsKeyword(
        text,
        keyword
      )
  );
}

/**
 * بررسی شرط‌های ترکیبی.
 *
 * any:
 * حداقل یکی
 *
 * all:
 * همه
 */
function matchesCondition(
  text,
  condition
) {
  if (
    !condition ||
    typeof condition !==
      "object"
  ) {
    return false;
  }

  if (
    Array.isArray(
      condition.all
    )
  ) {
    return condition.all.every(
      (item) =>
        matchesGroup(
          text,
          item
        )
    );
  }

  if (
    Array.isArray(
      condition.any
    )
  ) {
    return condition.any.some(
      (item) =>
        matchesGroup(
          text,
          item
        )
    );
  }

  return false;
}

/**
 * یک group می‌تواند:
 *
 * - آرایه keyword باشد
 * - شرط ترکیبی باشد
 */
function matchesGroup(
  text,
  group
) {
  if (!group) {
    return false;
  }

  if (
    Array.isArray(
      group
    )
  ) {
    /**
     * آرایه‌ای از string:
     * OR
     */
    if (
      group.every(
        (item) =>
          typeof item ===
          "string"
      )
    ) {
      return matchesKeywordList(
        text,
        group
      );
    }

    /**
     * آرایه شرط‌های ترکیبی.
     */
    return group.some(
      (item) =>
        typeof item ===
          "object" &&
        matchesCondition(
          text,
          item
        )
    );
  }

  if (
    typeof group ===
    "object"
  ) {
    return matchesCondition(
      text,
      group
    );
  }

  return false;
}

/**
 * بررسی groups یک automation.
 */
function matchesGroups(
  text,
  groups
) {
  if (
    !groups ||
    typeof groups !==
      "object"
  ) {
    return false;
  }

  if (
    Array.isArray(
      groups.any
    )
  ) {
    return groups.any.some(
      (condition) =>
        matchesGroup(
          text,
          condition
        )
    );
  }

  if (
    Array.isArray(
      groups.all
    )
  ) {
    return groups.all.every(
      (condition) =>
        matchesGroup(
          text,
          condition
        )
    );
  }

  return false;
}

/**
 * پیدا کردن automation مناسب.
 *
 * priority بالاتر اول بررسی می‌شود.
 */
export function findAutomation(
  text
) {
  if (
    !String(text ?? "").trim()
  ) {
    return null;
  }

  const enabledAutomations =
    automations
      .filter(
        (automation) =>
          automation.enabled
      )
      .sort(
        (a, b) =>
          b.priority -
          a.priority
      );

  for (
    const automation
    of enabledAutomations
  ) {
    /**
     * automationهای ساده.
     */
    if (
      Array.isArray(
        automation.keywords
      ) &&
      matchesKeywordList(
        text,
        automation.keywords
      )
    ) {
      return automation;
    }

    /**
     * automationهای گروهی.
     */
    if (
      automation.groups &&
      matchesGroups(
        text,
        automation.groups
      )
    ) {
      return automation;
    }
  }

  return null;
}
