/**
 * متن‌های ثابت پاسخ ربات.
 *
 * نکته توسعه: مقدار response در automation.js باید دقیقاً با یکی از کلیدهای
 * این object یکسان باشد؛ در غیر این صورت ربات پاسخ پیدا نمی‌کند.
 */
export const responses = {
  // پاسخ آدرس عمداً فقط متن است و لوکیشن یا دکمه ندارد.
  address: {
    type: "text",
    text: "مشهد، بین هنرور ۲۰ و ۲۲ قرار دارد."
  },

  // پاسخ قیمت فعلاً ثابت است؛ بعداً می‌توان آن را به دیتابیس/API وصل کرد.
  price: {
    type: "text",
    text: "اسم محصول رو بفرستید تا قیمتش رو اعلام کنیم."
  },

  // پاسخ مشاهده محصولات: لینک مستقیم داخل متن + دو دکمه شیشه‌ای آبی زیر پیام.
  products: {
    type: "text",
    text:
      "برای مشاهده محصولات و اجناس، به کانال‌های ما در ایتا و روبیکا سر بزنید:\n\n" +
      "ایتا:\n" +
      "[@Shoma\_shop](https://eitaa.com/shoma_shop)\n\n" +
      "روبیکا:\n" +
      "[@Shoma\_shop](https://rubika.ir/shoma_shop)",
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

  hello: {
    type: "text",
    text: "سلام.\nجانم در خدمتم"
  },

  support: {
    type: "text",
    text: "برای ارتباط با پشتیبانی پیام دهید."
  }
};
