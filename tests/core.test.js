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
  "product keywords match product names and categories",
  () => {
    assert.equal(
      findAutomation(
        "ریکا چی دارین؟"
      )?.id,
      "productSearch"
    );

    assert.equal(
      findAutomation(
        "پریل چی دارید؟"
      )?.id,
      "productSearch"
    );

    assert.equal(
      findAutomation(
        "مایع ظرفشویی چی دارین؟"
      )?.id,
      "productSearch"
    );

    assert.equal(
      findAutomation(
        "پودر لباسشویی میخوام"
      )?.id,
      "productSearch"
    );

    assert.equal(
      findAutomation(
        "تاید دارید؟"
      )?.id,
      "productSearch"
    );
  }
);

test(
  "product keyword wins over hello when greeting and product request are combined",
  () => {
    assert.equal(
      findAutomation(
        "سلام مایع ظرفشویی چی دارین؟"
      )?.id,
      "productSearch"
    );

    assert.equal(
      findAutomation(
        "سلام ریکا چی دارید؟"
      )?.id,
      "productSearch"
    );
  }
);

test(
  "generic product listing requests still use products automation",
  () => {
    assert.equal(
      findAutomation(
        "محصولات‌تون چیان؟"
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
  "price intent keeps priority over product intent",
  () => {
    assert.equal(
      findAutomation(
        "قیمت ریکا چنده؟"
      )?.id,
      "price"
    );

    assert.equal(
      findAutomation(
        "قیمت مایع ظرفشویی"
      )?.id,
      "price"
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
