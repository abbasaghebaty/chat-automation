/**
 * قوانین پاسخ‌گویی خودکار ربات.
 *
 * هر rule یک intent مشخص دارد و به یک response در messages/responses.js وصل است.
 * priority برای حل تداخل بین عبارت‌ها استفاده می‌شود؛ عدد بزرگ‌تر زودتر بررسی می‌شود.
 *
 * نکته توسعه:
 * - برای افزودن intent جدید، هم rule این فایل و هم response متناظر را اضافه کنید.
 * - عبارت‌های طولانی‌تر یا دقیق‌تر را می‌توان در priority بالاتر قرار داد.
 * - matcher قبل از بررسی ruleها، متن فارسی را normalize می‌کند و punctuation را حذف می‌کند.
 */
export const automations = [
  {
    id: "address",
    enabled: true,
    keywords: ["آدرس", "ادرس", "لوکیشن", "مکان", "آدرس مغازه", "آدرس فروشگاه"],
    response: "address",
    priority: 100
  },

  {
    id: "hours",
    enabled: true,
    keywords: [
      "ساعت کاری",
      "ساعات کاری",
      "ساعت کار",
      "ساعت باز بودن",
      "کی بازید",
      "کی باز هستید",
      "چه ساعتی بازید",
      "چه ساعتی باز هستید"
    ],
    response: "hours",
    priority: 98
  },

  {
    id: "price",
    enabled: true,
    keywords: [
      "قیمت",
      "قیمتش",
      "قیمت ها",
      "قیمتها",
      "قیمت‌ها",
      "چنده",
      "چند قیمت",
      "قیمت چند",
      "هزینه"
    ],
    response: "price",
    priority: 95
  },

  {
    id: "products",
    enabled: true,
    keywords: [
      "محصول",
      "محصولات",
      "جنس",
      "جنسها",
      "جنس ها",
      "جنس‌ها",
      "اجناس",
      "اجناس رو بفرست",
      "لیست محصولات",
      "لیست اجناس",
      "لیست کالا",
      "کالا",
      "کالاها",
      "چی دارید",
      "چه دارید",
      "چه محصولاتی",
      "چی میفروشید",
      "چی می فروشید",
      "چه میفروشید",
      "چه می فروشید",
      "موجودی"
    ],
    response: "products",
    priority: 90
  },

  {
    id: "website",
    enabled: true,
    keywords: [
      "سایت",
      "وب سایت",
      "وبسایت",
      "آدرس سایت",
      "سایت شما",
      "سایت فروشگاه",
      "لینک سایت"
    ],
    response: "website",
    priority: 87
  },

  {
    id: "contact",
    enabled: true,
    keywords: [
      "تماس",
      "شماره",
      "شماره تماس",
      "شماره تلفن",
      "تلفن",
      "پیام به شما",
      "راه ارتباطی"
    ],
    response: "contact",
    priority: 85
  },

  {
    id: "support",
    enabled: true,
    keywords: ["پشتیبانی", "ادمین", "پشتیبان", "ارتباط با پشتیبانی"],
    response: "support",
    priority: 84
  },

  {
    id: "order",
    enabled: true,
    keywords: [
      "سفارش",
      "ثبت سفارش",
      "سفارش دادن",
      "سفارش بدم",
      "خرید",
      "خرید کردن",
      "چطور سفارش بدم",
      "چجوری سفارش بدم"
    ],
    response: "order",
    priority: 80
  },

  {
    id: "shipping",
    enabled: true,
    keywords: [
      "ارسال",
      "نحوه ارسال",
      "شرایط ارسال",
      "پست",
      "پست پیشتاز",
      "پیک",
      "ارسال رایگان",
      "ارسال درون شهری",
      "ارسال سراسری"
    ],
    response: "shipping",
    priority: 75
  },

  {
    id: "telegram",
    enabled: true,
    keywords: ["تلگرام", "کانال تلگرام", "پیج تلگرام"],
    response: "telegram",
    priority: 70
  },

  {
    id: "eitaa",
    enabled: true,
    keywords: ["ایتا", "کانال ایتا"],
    response: "eitaa",
    priority: 69
  },

  {
    id: "rubika",
    enabled: true,
    keywords: ["روبیکا", "کانال روبیکا"],
    response: "rubika",
    priority: 68
  },

  {
    id: "instagram",
    enabled: true,
    keywords: ["اینستاگرام", "اینستا", "پیج اینستا", "پیج اینستاگرام"],
    response: "instagram",
    priority: 67
  },

  {
    id: "social",
    enabled: true,
    keywords: ["شبکه اجتماعی", "شبکه های اجتماعی", "شبکه‌های اجتماعی", "همه شبکه ها"],
    response: "social",
    priority: 66
  },

  {
    id: "hello",
    enabled: true,
    keywords: ["سلام", "درود"],
    response: "hello",
    priority: 10
  }
];
