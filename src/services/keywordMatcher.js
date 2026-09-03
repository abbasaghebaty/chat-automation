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
 * یک keyword را روی متن بررسی می‌کند.
 *
 * ترتیب:
 * 1. تطبیق دقیق
 * 2. تطبیق بدون فاصله
 * 3. fuzzy محدود
 */
function containsKeyword(text, keyword) {
  const normalizedText = normalizeText(text);
  const normalizedKeyword = normalizeText(keyword);

  if (
    !normalizedText ||
    !normalizedKeyword
  ) {
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
   * پوشش عبارت‌هایی مثل:
   *
   * ساعت کاری
   * ساعتکاری
   */
  const compactText = compact(
    normalizedText
  );

  const compactKeyword = compact(
    normalizedKeyword
  );

  if (
    compactText.includes(
      compactKeyword
    )
  ) {
    return true;
  }

  const maxDistance =
    getTypoTolerance(
      compactKeyword.length
    );

  if (maxDistance === 0) {
    return false;
  }

  const textTokens =
    tokenize(normalizedText);

  const keywordTokens =
    tokenize(normalizedKeyword);

  if (
    !textTokens.length ||
    !keywordTokens.length
  ) {
    return false;
  }

  const targetTokenCount =
    keywordTokens.length;

  const minTokenCount =
    Math.max(
      1,
      targetTokenCount - 1
    );

  const maxTokenCount =
    Math.min(
      textTokens.length,
      targetTokenCount + 1
    );

  for (
    let count = minTokenCount;
    count <= maxTokenCount;
    count += 1
  ) {
    for (
      let start = 0;
      start <=
        textTokens.length - count;
      start += 1
    ) {
      const candidate =
        textTokens
          .slice(
            start,
            start + count
          )
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

/**
 * هر مجموعه keyword را بررسی می‌کند.
 */
function matchesKeywordList(
  text,
  keywords
) {
  if (
    !Array.isArray(keywords)
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
 * ساختارهای گروهی:
 *
 * any: یکی از شروط باید برقرار باشد
 *
 * all: تمام شروط باید برقرار باشند
 *
 * مثال:
 *
 * {
 *   all: [
 *     ["دارین", "دارید"],
 *     ["چی", "محصول"]
 *   ]
 * }
 *
 * یعنی:
 * یک کلمه از گروه اول
 * و
 * یک کلمه از گروه دوم
 */
function matchesCondition(
  text,
  condition
) {
  if (
    !condition ||
    typeof condition !== "object"
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

function matchesGroup(
  text,
  group
) {
  if (
    !group
  ) {
    return false;
  }

  /**
   * اگر یک آرایه باشد،
   * یعنی این آرایه یک گروه keyword است.
   */
  if (
    Array.isArray(group)
  ) {
    /**
     * اگر آرایه شامل string باشد،
     * یعنی OR بین کلمات.
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
     * اگر داخل آرایه
     * object وجود داشته باشد،
     * یعنی شرط ترکیبی.
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
 * بررسی groups مربوط به automation.
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

  /**
   * any:
   * حداقل یکی از شرط‌ها باید درست باشد.
   */
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

  /**
   * all:
   * تمام شرط‌ها باید درست باشند.
   */
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
     * automationهای قدیمی
     * که keywords دارند.
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
     * automationهای جدید
     * که groups دارند.
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
