/**
 * ============================================================
 * پاسخ‌های قابل ارسال توسط ربات
 * ============================================================
 *
 * typeهای پشتیبانی‌شده:
 *
 * text:
 *   پیام متنی معمولی
 *
 * location:
 *   ارسال مختصات به کاربر
 *
 * buttons:
 *   دکمه‌های Inline Keyboard
 *
 * style: "primary"
 *   استایل آبی استاندارد دکمه Telegram
 * ============================================================
 */

export const responses = {
  /**
   * آدرس فروشگاه
   *
   * این پاسخ علاوه بر متن، لوکیشن واقعی فروشگاه را هم ارسال می‌کند.
   */
  address: {
    type: "location",

    latitude: 36.325273576311425,
    longitude: 59.60890905931591,

    text: "مشهد، بین هنرور ۲۰ و ۲۲ قرار دارد."
  },

  /**
   * ============================================================
   * ساعت کاری
   * ============================================================
   *
   * پیام اصلی ثابت است.
   *
   * دکمه پایین پیام callback دارد.
   * وقتی کاربر روی آن بزند، وضعیت فروشگاه همان لحظه
   * در سمت Worker محاسبه می‌شود.
   *
   * توجه:
   * خود این پیام هیچ‌وقت edit نمی‌شود.
   */
  hours: {
    type: "text",

    text:
      "🕘 ساعت فعالیت فروشگاه:\n\n" +
      "شنبه تا پنجشنبه\n" +
      "۹:۰۰ تا ۱۴:۰۰\n" +
      "۱۷:۰۰ تا ۲۲:۰۰",

    buttons: [
      [
        {
          text: "الان فروشگاه بازه؟",
          callback_data: "check_store_hours",
          style: "primary"
        }
      ]
    ]
  },

  /**
   * قیمت
   */
  price: {
    type: "text",

    text:
      "اسم محصول رو بفرستید تا قیمتش رو اعلام کنیم."
  },

  /**
   * محصولات
   */
  products: {
    type: "text",

    text:
      "برای مشاهده محصولات و اجناس، به کانال‌های ما در ایتا و روبیکا سر بزنید:\n\n" +
      "ایتا:\n" +
      "<a href=\"https://eitaa.com/shoma_shop\">@Shoma_shop</a>\n\n" +
      "روبیکا:\n" +
      "<a href=\"https://rubika.ir/shoma_shop\">@Shoma_shop</a>",

    buttons: [
      [
        {
          text: "ایتا",
          url: "https://eitaa.com/shoma_shop",
          style: "primary"
        },
        {
          text: "روبیکا",
          url: "https://rubika.ir/shoma_shop",
          style: "primary"
        }
      ]
    ]
  },

  /**
   * سایت
   */
  website: {
    type: "text",

    text:
      "سایت شما شاپ:\n" +
      "<a href=\"https://shoma-shop.ir/\">shoma-shop.ir</a>",

    buttons: [
      [
        {
          text: "سایت",
          url: "https://shoma-shop.ir/",
          style: "primary"
        }
      ]
    ]
  },

  /**
   * شماره تماس
   */
  contact: {
    type: "text",

    text:
      "شماره تماس شما شاپ:\n" +
      "09154819081"
  },

  /**
   * پشتیبانی
   */
  support: {
    type: "text",

    text:
      "برای پشتیبانی با شماره 09154819081 تماس بگیرید."
  },

  /**
   * سفارش
   */
  order: {
    type: "text",

    text:
      "برای ثبت سفارش می‌توانید از طریق تلگرام، ایتا، روبیکا یا اینستاگرام با شما شاپ در ارتباط باشید.",

    buttons: [
      [
        {
          text: "تلگرام",
          url: "https://t.me/shoma_shop_ir",
          style: "primary"
        },
        {
          text: "ایتا",
          url: "https://eitaa.com/shoma_shop",
          style: "primary"
        }
      ],
      [
        {
          text: "روبیکا",
          url: "https://rubika.ir/shoma_shop",
          style: "primary"
        },
        {
          text: "اینستاگرام",
          url: "https://instagram.com/shoma_shop.ir",
          style: "primary"
        }
      ]
    ]
  },

  /**
   * ارسال
   */
  shipping: {
    type: "text",

    text:
      "شرایط ارسال شما شاپ:\n\n" +
      "• ارسال رایگان در محدوده فروشگاه\n" +
      "• ارسال درون‌شهری با پیک\n" +
      "• ارسال سراسری با پست پیشتاز"
  },

  telegram: {
    type: "text",

    text:
      "کانال تلگرام شما شاپ:\n" +
      "<a href=\"https://t.me/shoma_shop_ir\">@shoma_shop_ir</a>",

    buttons: [
      [
        {
          text: "تلگرام",
          url: "https://t.me/shoma_shop_ir",
          style: "primary"
        }
      ]
    ]
  },

  eitaa: {
    type: "text",

    text:
      "کانال ایتا شما شاپ:\n" +
      "<a href=\"https://eitaa.com/shoma_shop\">@Shoma_shop</a>",

    buttons: [
      [
        {
          text: "ایتا",
          url: "https://eitaa.com/shoma_shop",
          style: "primary"
        }
      ]
    ]
  },

  rubika: {
    type: "text",

    text:
      "کانال روبیکا شما شاپ:\n" +
      "<a href=\"https://rubika.ir/shoma_shop\">@Shoma_shop</a>",

    buttons: [
      [
        {
          text: "روبیکا",
          url: "https://rubika.ir/shoma_shop",
          style: "primary"
        }
      ]
    ]
  },

  instagram: {
    type: "text",

    text:
      "اینستاگرام شما شاپ:\n" +
      "<a href=\"https://instagram.com/shoma_shop.ir\">@shoma_shop.ir</a>",

    buttons: [
      [
        {
          text: "اینستاگرام",
          url: "https://instagram.com/shoma_shop.ir",
          style: "primary"
        }
      ]
    ]
  },

  social: {
    type: "text",

    text:
      "راه‌های ارتباطی شما شاپ:",

    buttons: [
      [
        {
          text: "تلگرام",
          url: "https://t.me/shoma_shop_ir",
          style: "primary"
        },
        {
          text: "ایتا",
          url: "https://eitaa.com/shoma_shop",
          style: "primary"
        }
      ],
      [
        {
          text: "روبیکا",
          url: "https://rubika.ir/shoma_shop",
          style: "primary"
        },
        {
          text: "اینستاگرام",
          url: "https://instagram.com/shoma_shop.ir",
          style: "primary"
        }
      ]
    ]
  },

  hello: {
    type: "text",

    text:
      "سلام.\nجانم در خدمتم"
  }
};
