/**
 * تنظیمات رفتار خودکار ربات.
 *
 * هر automation شامل این فیلدهاست:
 * - id: شناسه داخلی یکتا
 * - enabled: فعال/غیرفعال بودن rule
 * - keywords: عبارت‌هایی که باید در متن پیدا شوند
 * - response: کلیدی که به messages/responses.js اشاره می‌کند
 * - priority: هرچه بیشتر باشد، rule زودتر بررسی می‌شود
 *
 * نکته توسعه:
 * برای اضافه کردن یک پاسخ جدید، باید هم یک automation اینجا ساخته شود
 * و هم کلید متناظر آن در messages/responses.js وجود داشته باشد.
 */
export const automations = [
  {
    id: "address",
    enabled: true,
    keywords: ["آدرس", "ادرس", "لوکیشن", "مکان"],
    response: "address",
    priority: 100
  },
  {
    id: "price",
    enabled: true,
    keywords: ["قیمت", "قیمتش", "چنده", "هزینه", "چند"],
    response: "price",
    priority: 90
  },
  {
    id: "products",
    enabled: true,
    keywords: [
      "محصول",
      "محصولات",
      "جنس",
      "جنسها",
      "اجناس",
      "کالا",
      "کالاها",
      "موجودی",
      "چی دارید",
      "چه دارید",
      "چه محصولاتی"
    ],
    response: "products",
    priority: 85
  },
  {
    id: "support",
    enabled: true,
    keywords: ["پشتیبانی", "ادمین", "تماس", "ارتباط"],
    response: "support",
    priority: 80
  },
  {
    id: "hello",
    enabled: true,
    keywords: ["سلام", "درود"],
    response: "hello",
    priority: 10
  }
];
