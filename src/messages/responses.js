/**
 * پاسخ‌های قابل استفاده توسط automationها.
 *
 * کلیدهای این object باید دقیقاً با مقدار response در automation.js یکی باشند.
 * اگر automation جدیدی اضافه شد، نبودن کلید متناظر باعث می‌شود پاسخ ارسال نشود.
 */
export const responses = {
  address: {
    type: "location",
    latitude: 36.325273576311425,
    longitude: 59.60890905931591,
    text: "مشهد ، بین هنرور 20 و 22",
    buttons: [
      [
        {
          text: "نشان",
          url: "https://nshn.ir/35Qb1MaUIJjDVc",
          style: "primary"
        },
        {
          text: "Google Maps",
          url: "https://maps.app.goo.gl/Haixv2k28U9JJi878",
          style: "primary"
        }
      ]
    ]
  },

  // قبلاً automation مربوط به price وجود داشت ولی این پاسخ اصلاً تعریف نشده بود.
  // قیمت ثابت از دیتابیس/API در پروژه وجود ندارد؛ بنابراین پاسخ امن و کاربردی
  // کاربر را به ارسال نام محصول هدایت می‌کند.
  price: {
    type: "text",
    text: "اسم محصول رو بفرستید تا قیمتش رو اعلام کنیم."
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
