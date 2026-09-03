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
  "generic product requests use productSearch",
  () => {
    assert.equal(
      findAutomation("چی دارین؟")?.id,
      "productSearch"
    );

    assert.equal(
      findAutomation("چه محصولاتی دارید؟")?.id,
      "productSearch"
    );

    assert.equal(
      findAutomation("موجوده؟")?.id,
      "productSearch"
    );

    assert.equal(
      findAutomation("هرچی دارید؟")?.id,
      "productSearch"
    );
  }
);

test(
  "generic price requests use price",
  () => {
    assert.equal(
      findAutomation("چنده؟")?.id,
      "price"
    );

    assert.equal(
      findAutomation("قیمتش چنده؟")?.id,
      "price"
    );

    assert.equal(
      findAutomation("قیمت این محصول چقدره؟")?.id,
      "price"
    );
  }
);

