/**
 * پاسخ‌های قابل استفاده توسط automationها.
 *
 * کلیدهای این object باید دقیقاً با مقدار response در automation.js یکی باشند.
 * هر automation جدید باید یک response متناظر داشته باشد.
 *
 * لینک کانال‌ها عمداً هم داخل متن آمده و هم به شکل Inline Keyboard ارسال می‌شود:
 * - متن برای کاربری که ترجیح می‌دهد مستقیم روی لینک بزند
 * - دکمه برای دسترسی سریع‌تر و ظاهر مرتب‌تر
 */
export const responses = {
  address: {
    type: "text",
    text: "مشهد، بین هنرور ۲۰ و ۲۲ قرار دارد."
  },

  // قیمت ثابت از دیتابیس/API در پروژه وجود ندارد؛ بنابراین کاربر باید
  // نام محصول را بفرستد تا در آینده بتوان این بخش را به قیمت واقعی وصل کرد.
  price: {
    type: "text",
    text: "اسم محصول رو بفرستید تا قیمتش رو اعلام کنیم."
  },

  products: {
    type: "text",
    text:
      "برای مشاهده محصولات و اجناس، به کانال‌های ما در ایتا و روبیکا سر بزنید:\n\n" +
      "ایتا: https://eitaa.com/shoma_shop\n" +
      "روبیکا: https://rubika.ir/shoma_shop\n\n" +
      "آیدی کانال در هر دو پلتفرم: @shoma_shop",
    buttons: [
      [
        {
          text: "کانال ایتا",
          url: "https://eitaa.com/shoma_shop",
          style: "primary"
        },
        {
          text: "کانال روبیکا",
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
