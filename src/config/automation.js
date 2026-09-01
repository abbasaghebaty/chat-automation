export const automations = [
  {
    id: "address",

    enabled: true,

    keywords: [
      "آدرس",
      "ادرس",
      "لوکیشن",
      "مکان"
    ],

    response: "address",

    priority: 100
  },

  {
    id: "price",

    enabled: true,

    keywords: [
      "قیمت",
      "قیمتش",
      "چنده",
      "چند",
      "هزینه"
    ],

    response: "price",

    priority: 90
  },

  {
    id: "support",

    enabled: true,

    keywords: [
      "پشتیبانی",
      "ادمین",
      "تماس",
      "ارتباط"
    ],

    response: "support",

    priority: 80
  },

  {
    id: "hello",

    enabled: true,

    keywords: [
      "سلام",
      "درود"
    ],

    response: "hello",

    priority: 10
  }
];
