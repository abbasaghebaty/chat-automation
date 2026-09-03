import assert from "node:assert/strict";
import test from "node:test";

import {
  automations
} from "../src/config/automation.js";

import {
  responses
} from "../src/messages/responses.js";

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
  "basic automations still work",
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
  "product existence vocabulary works",
  () => {
    assert.equal(
      findAutomation(
        "دارین؟"
      )?.id,
      "productSearch"
    );

    assert.equal(
      findAutomation(
        "دارید؟"
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
        "هست؟"
      )?.id,
      "productSearch"
    );
  }
);

test(
  "purchase questions go to order",
  () => {
    assert.equal(
      findAutomation(
        "میخوام بخرم"
      )?.id,
      "order"
    );

    assert.equal(
      findAutomation(
        "میخواهم خرید کنم"
      )?.id,
      "order"
    );

    assert.equal(
      findAutomation(
        "چطور خرید کنم؟"
      )?.id,
      "order"
    );

    assert.equal(
      findAutomation(
        "چجوری سفارش بدم؟"
      )?.id,
      "order"
    );

    assert.equal(
      findAutomation(
        "نحوه خرید"
      )?.id,
      "order"
    );

    assert.equal(
      findAutomation(
        "درباره خرید سوال داشتم"
      )?.id,
      "order"
    );
  }
);

test(
  "payment questions go to payment",
  () => {
    assert.equal(
      findAutomation(
        "روش پرداخت چیه؟"
      )?.id,
      "payment"
    );

    assert.equal(
      findAutomation(
        "چطور پرداخت کنم؟"
      )?.id,
      "payment"
    );

    assert.equal(
      findAutomation(
        "شماره کارت؟"
      )?.id,
      "payment"
    );

    assert.equal(
      findAutomation(
        "کارت به کارت کنم؟"
      )?.id,
      "payment"
    );

    assert.equal(
      findAutomation(
        "رسید رو کجا بفرستم؟"
      )?.id,
      "payment"
    );

    assert.equal(
      findAutomation(
        "درگاه پرداخت دارید؟"
      )?.id,
      "payment"
    );
  }
);

test(
  "shipping remains separate from payment",
  () => {
    assert.equal(
      findAutomation(
        "شرایط ارسال چیه؟"
      )?.id,
      "shipping"
    );

    assert.equal(
      findAutomation(
        "چطور ارسال میکنید؟"
      )?.id,
      "shipping"
    );
  }
);

test(
  "fuzzy matching accepts one spelling error",
  () => {
    assert.equal(
      findAutomation(
        "ذارین؟"
      )?.id,
      "productSearch"
    );

    assert.equal(
      findAutomation(
        "دارسید"
      )?.id,
      "productSearch"
    );

    assert.equal(
      findAutomation(
        "موجودع"
      )?.id,
      "productSearch"
    );
  }
);

test(
  "fuzzy matching accepts two spelling errors",
  () => {
    assert.equal(
      findAutomation(
        "ذارید؟"
      )?.id,
      "productSearch"
    );
  }
);

test(
  "fuzzy matching works inside attached words",
  () => {
    assert.equal(
      findAutomation(
        "شامپوهمدارین"
      )?.id,
      "productSearch"
    );

    assert.equal(
      findAutomation(
        "شامپوهمذارین"
      )?.id,
      "productSearch"
    );

    assert.equal(
      findAutomation(
        "اینمحصولودارین؟"
      )?.id,
      "productSearch"
    );
  }
);

test(
  "price intent works independently from product names",
  () => {
    assert.equal(
      findAutomation(
        "چنده؟"
      )?.id,
      "price"
    );

    assert.equal(
      findAutomation(
        "قیمتش؟"
      )?.id,
      "price"
    );

    assert.equal(
      findAutomation(
        "چقدره؟"
      )?.id,
      "price"
    );

    assert.equal(
      findAutomation(
        "چند تومنه؟"
      )?.id,
      "price"
    );
  }
);

test(
  "price has higher priority than product intent",
  () => {
    assert.equal(
      findAutomation(
        "یک محصول ناشناخته چنده؟"
      )?.id,
      "price"
    );

    assert.equal(
      findAutomation(
        "قیمت این جنس چقدره؟"
      )?.id,
      "price"
    );
  }
);

test(
  "address wins over generic existence words",
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
  "contact wins over generic existence words",
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
  "website wins over generic existence words",
  () => {
    assert.equal(
      findAutomation(
        "سایت دارید؟"
      )?.id,
      "website"
    );
  }
);

test(
  "store hours still work",
  () => {
    assert.equal(
      findAutomation(
        "ساعت کاری"
      )?.id,
      "hours"
    );

    assert.equal(
      findAutomation(
        "ساعکاری"
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
