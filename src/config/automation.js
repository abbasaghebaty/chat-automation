/**
 * قوانین پاسخ‌گویی خودکار ربات.
 *
 * هر automation یک intent مشخص دارد.
 *
 * priority برای حل تداخل بین intentها استفاده می‌شود.
 */

import { vocabulary } from "./vocabulary.js";

export const automations = [
  {
    id: "address",
    enabled: true,

    keywords: [
      "آدرس",
      "ادرس",
      "نشانی",
      "نشونی",
      "لوکیشن",
      "لوکیشن مغازه",
      "مکان",
      "موقعیت",
      "موقعیت مغازه",
      "آدرس مغازه",
      "آدرس فروشگاه",
      "مغازه کجاست",
      "فروشگاه کجاست",
      "کجایید",
      "کجا هستید"
    ],

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
      "ساعت باز",
      "ساعت بسته شدن",
      "ساعت تعطیلی",
      "چه ساعتی بازید",
      "چه ساعتی باز هستید",
      "چه زمانی بازید",
      "چه زمانی باز هستید",
      "کی بازید",
      "کی باز هستید",
      "کی باز میکنید",
      "کی باز می کنید",
      "کی باز می‌کنید",
      "چه موقع بازید",
      "چه موقع باز هستید",
      "تا کی بازید",
      "تا کی باز هستید",
      "کی میبندید",
      "کی میبندین",
      "کی می‌بندید",
      "بازید",
      "ساعت",
      "باز هستید",
      "بازین",
      "باز هستین",
      "بازه",
      "بسته اید",
      "بسته‌اید",
      "تعطیلید",
      "تعطیل هستید"
    ],

    response: "hours",
    priority: 98
  },

  {
    id: "price",
    enabled: true,

    groups: {
      any: [
        vocabulary.price.pricing,
        vocabulary.price.amount
      ]
    },

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
      "چی می‌فروشید",
      "چه میفروشید",
      "چه می فروشید",
      "چه می‌فروشید"
    ],

    response: "products",
    priority: 90
  },

  /**
   * خرید و ثبت سفارش.
   *
   * این intent عمداً بالاتر از productSearch
   * قرار دارد تا عبارت‌هایی مثل:
   *
   * میخوام بخرم
   * چطور خرید کنم؟
   * نحوه خرید
   *
   * وارد سفارش شوند.
   */
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
      "خرید کنم",
      "چطور سفارش بدم",
      "چجوری سفارش بدم",
      "چطوری سفارش بدم",
      "چطور خرید کنم",
      "چجوری خرید کنم",
      "چطوری خرید کنم",
      "میخوام بخرم",
      "میخواهم بخرم",
      "میخواستم بخرم",
      "برای خرید",
      "درباره خرید",
      "در مورد خرید",
      "نحوه خرید",
      "روش خرید",
      "چطور سفارش ثبت کنم",
      "چجوری سفارش ثبت کنم",
      "چطوری سفارش ثبت کنم"
    ],

    response: "order",
    priority: 97
  },

  /**
   * پرداخت.
   *
   * این intent از خرید جداست.
   *
   * order:
   * نحوه خرید و ثبت سفارش
   *
   * payment:
   * نحوه پرداخت، واریز، شماره کارت، رسید و درگاه
   */
  {
    id: "payment",
    enabled: true,

    groups: {
      any: [
        vocabulary.payment.payment
      ]
    },

    response: "payment",
    priority: 96
  },

  /**
   * تشخیص درخواست محصول.
   */
  {
    id: "productSearch",
    enabled: true,

    groups: {
      any: [
        vocabulary.product.existence,
        vocabulary.product.request,
        vocabulary.product.desire
      ]
    },

    response: "productSearch",
    priority: 86
  },

  {
    id: "website",
    enabled: true,

    keywords: [
      "سایت",
      "وب سایت",
      "وبسایت",
      "وب‌سایت",
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
      "شماره مغازه",
      "شماره فروشگاه",
      "راه ارتباطی",
      "شمارتون"
    ],

    response: "contact",
    priority: 85
  },

  {
    id: "support",
    enabled: true,

    keywords: [
      "پشتیبانی",
      "ادمین",
      "پشتیبان",
      "ارتباط با پشتیبانی",
      "پاسخگویی",
      "اپراتور"
    ],

    response: "support",
    priority: 84
  },

  {
    id: "shipping",
    enabled: true,

    keywords: [
      "ارسال",
      "نحوه ارسال",
      "شرایط ارسال",
      "هزینه ارسال",
      "پست",
      "پست پیشتاز",
      "پیک",
      "ارسال رایگان",
      "ارسال درون شهری",
      "ارسال درون‌شهری",
      "ارسال سراسری",
      "چطور ارسال میکنید",
      "چطور ارسال می کنید",
      "چطوری ارسال میکنید",
      "چجوری ارسال میکنید"
    ],

    response: "shipping",
    priority: 75
  },

  {
    id: "telegram",
    enabled: true,

    keywords: [
      "تلگرام",
      "کانال تلگرام",
      "پیج تلگرام",
      "تلگرام شما"
    ],

    response: "telegram",
    priority: 70
  },

  {
    id: "eitaa",
    enabled: true,

    keywords: [
      "ایتا",
      "کانال ایتا",
      "ایتا شما"
    ],

    response: "eitaa",
    priority: 69
  },

  {
    id: "rubika",
    enabled: true,

    keywords: [
      "روبیکا",
      "کانال روبیکا",
      "روبیکا شما"
    ],

    response: "rubika",
    priority: 68
  },

  {
    id: "instagram",
    enabled: true,

    keywords: [
      "اینستاگرام",
      "اینستا",
      "پیج اینستا",
      "پیج اینستاگرام",
      "اینستای شما"
    ],

    response: "instagram",
    priority: 67
  },

  {
    id: "social",
    enabled: true,

    keywords: [
      "شبکه اجتماعی",
      "شبکه های اجتماعی",
      "شبکه‌های اجتماعی",
      "همه شبکه ها",
      "همه شبکه‌های اجتماعی",
      "راه های ارتباطی",
      "راه‌های ارتباطی"
    ],

    response: "social",
    priority: 66
  },

  {
    id: "hello",
    enabled: true,

    keywords: [
      "سلام",
      "درود",
      "سلام وقت بخیر",
      "سلام علیکم"
    ],

    response: "hello",
    priority: 10
  }
];
