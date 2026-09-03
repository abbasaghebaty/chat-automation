import assert from "node:assert/strict";
import test from "node:test";

import { automations } from "../src/config/automation.js";
import { responses } from "../src/messages/responses.js";

import {
  findAutomation,
  normalizeText
} from "../src/services/keywordMatcher.js";

import {
  getStoreStatus
} from "../src/services/storeHoursService.js";

/**
 * 2026-08-29 09:00 UTC
 * =
 * شنبه 12:30 تهران
 */
const OPEN_TIME =
  new Date(
    "2026-08-29T09:00:00.000Z"
  );

/**
 * 2026-08-29 10:30 UTC
 * =
 * شنبه 14:00 تهران
 */
const BEFORE_AFTERNOON_SHIFT =
  new Date(
    "2026-08-29T10:30:00.000Z"
  );

/**
 * 2026-08-28 10:00 UTC
 * =
 * جمعه 13:30 تهران
 */
const FRIDAY =
  new Date(
    "2026-08-28T10:00:00.000Z"
  );

/**
 * 2026-08-29 18:45 UTC
 * =
 * شنبه 22:15 تهران
 */
const AFTER_CLOSE =
  new Date(
    "2026-08-29T18:45:00.000Z"
  );

test(
  "all enabled automations point to existing responses",
  () => {
    for (
      const automation
      of automations
    ) {
      if (
        !automation.enabled
      ) {
        continue;
      }

      assert.ok(
        responses[
          automation.response
        ],
        `Missing response for automation: ${automation.id}`
      );
    }
  }
);

test(
  "Persian normalization handles Arabic letters and ZWNJ",
  () => {
    assert.equal(
      normalizeText(
        "كجا‌ هستید؟"
      ),
      "کجا هستید"
    );
  }
);

test(
  "exact keyword matching works",
  () => {
    assert.equal(
      findAutomation(
        "ساعت کاری"
      )?.id,
      "hours"
    );

    assert.equal(
      findAutomation(
        "محصولات"
      )?.id,
      "products"
    );

    assert.equal(
      findAutomation(
        "آدرس فروشگاه"
      )?.id,
      "address"
    );
  }
);

test(
  "generic product vocabulary detects product requests without product names",
  () => {
    assert.equal(
      findAutomation(
        "چی دارین؟"
      )?.id,
      "productSearch"
    );

    assert.equal(
      findAutomation(
        "چی دارید؟"
      )?.id,
      "productSearch"
    );

    assert.equal(
      findAutomation(
        "هرچی دارید؟"
      )?.id,
      "productSearch"
    );

    assert.equal(
      findAutomation(
        "چه محصولاتی دارید؟"
      )?.id,
      "productSearch"
    );

    assert.equal(
      findAutomation(
        "چه جنسی دارین؟"
      )?.id,
      "productSearch"
    );

    assert.equal(
      findAutomation(
        "موجوده؟"
      )?.id,
      "productSearch"
    );

    assert.equal(
      findAutomation(
        "موجودی دارید؟"
      )?.id,
      "productSearch"
    );
  }
);

test(
  "unknown product names are ignored and do not need to exist in code",
  () => {
    assert.equal(
      findAutomation(
        "محصول ناشناخته‌ای که در کد نیست دارید؟"
      )?.id,
      "productSearch"
    );

    assert.equal(
      findAutomation(
        "یک اسم کاملاً ناشناخته دارید؟"
      )?.id,
      "productSearch"
    );
  }
);

test(
  "price vocabulary detects price requests without product names",
  () => {
    assert.equal(
      findAutomation(
        "چنده؟"
      )?.id,
      "price"
    );

    assert.equal(
      findAutomation(
        "قیمتش چنده؟"
      )?.id,
      "price"
    );

    assert.equal(
      findAutomation(
        "قیمت این چقدره؟"
      )?.id,
      "price"
    );

    assert.equal(
      findAutomation(
        "چند تومنه؟"
      )?.id,
      "price"
    );

    assert.equal(
      findAutomation(
        "هزینه‌اش چقدره؟"
      )?.id,
      "price"
    );
  }
);

test(
  "product and price intents work with arbitrary product names",
  () => {
    assert.equal(
      findAutomation(
        "یک محصول ناشناخته چنده؟"
      )?.id,
      "price"
    );

    assert.equal(
      findAutomation(
        "اسم عجیب و ناشناخته دارید؟"
      )?.id,
      "productSearch"
    );
  }
);

test(
  "price intent keeps priority over product intent",
  () => {
    assert.equal(
      findAutomation(
        "قیمت محصول چنده؟"
      )?.id,
      "price"
    );

    assert.equal(
      findAutomation(
        "هزینه این جنس چقدره؟"
      )?.id,
      "price"
    );
  }
);

test(
  "address wins over generic product existence vocabulary",
  () => {
    assert.equal(
      findAutomation(
        "آدرس دارید؟"
      )?.id,
      "address"
    );

    assert.equal(
      findAutomation(
        "لوکیشن دارین؟"
      )?.id,
      "address"
    );
  }
);

test(
  "contact wins over generic product existence vocabulary",
  () => {
    assert.equal(
      findAutomation(
        "شماره دارید؟"
      )?.id,
      "contact"
    );
  }
);

test(
  "hours wins over generic product vocabulary",
  () => {
    assert.equal(
      findAutomation(
        "ساعت کاری دارید؟"
      )?.id,
      "hours"
    );
  }
);

test(
  "generic product listing requests still use products automation",
  () => {
    assert.equal(
      findAutomation(
        "محصولات"
      )?.id,
      "products"
    );

    assert.equal(
      findAutomation(
        "لیست محصولات"
      )?.id,
      "products"
    );

    assert.equal(
      findAutomation(
        "چی میفروشید؟"
      )?.id,
      "products"
    );
  }
);

test(
  "missing spaces can still match",
  () => {
    assert.equal(
      findAutomation(
        "ساعتکاری"
      )?.id,
      "hours"
    );
  }
);

test(
  "limited typo matching works",
  () => {
    assert.equal(
      findAutomation(
        "ساعکاری"
      )?.id,
      "hours"
    );

    assert.equal(
      findAutomation(
        "ادرس"
      )?.id,
      "address"
    );
  }
);

test(
  "generic hour word does not hijack unrelated messages",
  () => {
    assert.notEqual(
      findAutomation(
        "ساعت مچی"
      )?.id,
      "hours"
    );
  }
);

test(
  "store is open during first shift",
  () => {
    const result =
      getStoreStatus(
        OPEN_TIME
      );

    assert.equal(
      result.status,
      "open"
    );
  }
);

test(
  "store reports next shift after first shift",
  () => {
    const result =
      getStoreStatus(
        BEFORE_AFTERNOON_SHIFT
      );

    assert.equal(
      result.status,
      "closed"
    );

    assert.match(
      result.message,
      /۱۷:۰۰/
    );
  }
);

test(
  "Friday is closed",
  () => {
    const result =
      getStoreStatus(
        FRIDAY
      );

    assert.equal(
      result.status,
      "closed"
    );

    assert.equal(
      result.title,
      "فروشگاه امروز تعطیل است"
    );
  }
);

test(
  "store is closed after the last shift",
  () => {
    const result =
      getStoreStatus(
        AFTER_CLOSE
      );

    assert.equal(
      result.status,
      "closed"
    );

    assert.match(
      result.message,
      /شنبه/
    );
  }
);
