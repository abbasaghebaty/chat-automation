/**
 * پاسخ‌های قابل ارسال توسط ربات.
 *
 * typeهای پشتیبانی‌شده در responseService.js:
 * - text: پیام متنی معمولی
 * - location: ارسال یک نقطه روی نقشه به‌همراه متن اختیاری
 *
 * buttons اختیاری است و برای ساخت Inline Keyboard استفاده می‌شود.
 * style: "primary" یعنی استایل آبی دکمه در Telegram.
 *
 * اطلاعات فروشگاه در این فایل از اطلاعات سایت Shoma.shop گرفته شده است.
 * اگر شماره، ساعت کاری، لینک‌ها یا شرایط ارسال تغییر کرد، همین فایل را به‌روزرسانی کنید.
 */
export const responses = {
  // آدرس: لوکیشن واقعی روی نقشه + متن کوتاه آدرس.
  // هیچ دکمه‌ای برای این پاسخ ارسال نمی‌شود.
  address: {
    type: "location",
    latitude: 36.325273576311425,
    longitude: 59.60890905931591,
    text: "مشهد، بین هنرور ۲۰ و ۲۲ قرار دارد."
  },

  // ساعت کاری فعلی فروشگاه: هر روز دو بازه زمانی.
  hours: {
    type: "text",
    text: "ساعت کاری شما شاپ:\nهر روز ۹ تا ۱۴ و ۱۷ تا ۲۲"
  },

  // قیمت فعلاً بر اساس نام محصول پیگیری می‌شود و قیمت ثابت در کد ذخیره نشده است.
  price: {
    type: "text",
    text: "اسم محصول رو بفرستید تا قیمتش رو اعلام کنیم."
  },

  // کانال محصولات: لینک مستقیم در متن + دو دکمه شیشه‌ای آبی.
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

  // لینک رسمی سایت فروشگاه.
  website: {
    type: "text",
    text: "سایت شما شاپ:\n<a href=\"https://shoma-shop.ir/\">shoma-shop.ir</a>",
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

  // شماره تماس به‌روز فروشگاه.
  contact: {
    type: "text",
    text: "شماره تماس شما شاپ:\n09154819081"
  },

  // پشتیبانی فعلاً به مسیر تماس ارجاع می‌دهد چون کانال/آیدی پشتیبانی مستقلی در سایت مشخص نشده است.
  support: {
    type: "text",
    text: "برای پشتیبانی با شماره 09154819081 تماس بگیرید."
  },

  // روش‌های ثبت سفارش طبق سایت: تلگرام، ایتا، روبیکا و اینستاگرام.
  order: {
    type: "text",
    text: "برای ثبت سفارش می‌توانید از طریق تلگرام، ایتا، روبیکا یا اینستاگرام با شما شاپ در ارتباط باشید.",
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

  // شرایط ارسال طبق توضیح سایت.
  shipping: {
    type: "text",
    text:
      "شرایط ارسال شما شاپ:\n" +
      "• ارسال رایگان در محدوده فروشگاه\n" +
      "• ارسال درون‌شهری با پیک\n" +
      "• ارسال سراسری با پست پیشتاز"
  },

  telegram: {
    type: "text",
    text: "کانال تلگرام شما شاپ:\n<a href=\"https://t.me/shoma_shop_ir\">@shoma_shop_ir</a>",
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
    text: "کانال ایتا شما شاپ:\n<a href=\"https://eitaa.com/shoma_shop\">@Shoma_shop</a>",
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
    text: "کانال روبیکا شما شاپ:\n<a href=\"https://rubika.ir/shoma_shop\">@Shoma_shop</a>",
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
    text: "اینستاگرام شما شاپ:\n<a href=\"https://instagram.com/shoma_shop.ir\">@shoma_shop.ir</a>",
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
    text: "راه‌های ارتباطی شما شاپ:",
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
    text: "سلام.\nجانم در خدمتم"
  }
};
