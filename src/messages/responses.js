export const responses = {
  address: {
    type: "location",

    latitude:
      36.325273576311425,

    longitude:
      59.60890905931591,

    text:
      "مشهد، بین هنرور ۲۰ و ۲۲\n\n" +
      "قبل از اینکه بخواین حضوری بیاین، ساعت کاری فروشگاه رو چک کنین.\n\n" +
      "برای دریافت ساعت کاری، این پیام رو بفرستین:\n" +
      "<code>ساعت کاری شما شاپ</code>",

    buttons: [
      [
        {
          text:
            "مسیریابی",

          url:
            "https://www.google.com/maps/dir/?api=1&destination=36.325273576311425,59.60890905931591",

          style:
            "primary"
        },

        {
          text:
            "نمایش در نقشه",

          url:
            "https://www.google.com/maps/search/?api=1&query=36.325273576311425,59.60890905931591",

          style:
            "primary"
        }
      ]
    ]
  },

  hours: {
    type: "text",

    text:
      "ساعت کاری شما شاپ:\n\n" +
      "شنبه تا پنجشنبه\n" +
      "۹:۰۰ تا ۱۴:۰۰\n" +
      "۱۷:۰۰ تا ۲۲:۰۰\n\n" +
      "جمعه: تعطیل",

    buttons: [
      [
        {
          text:
            "الان فروشگاه بازه؟",

          callback_data:
            "check_store_hours",

          style:
            "primary"
        }
      ]
    ]
  },

  price: {
    type: "text",

    text:
      "همه اجناس و قیمت‌های شما شاپ در کانال‌ها قرار گرفته‌اند و می‌تونید لیست محصولات و قیمت‌ها رو اونجا ببینید.\n\n" +
      "با این حال، اگه مایل هستین، اسم محصول رو همین‌جا بفرستین تا قیمتش رو بهتون اعلام کنیم.",

    buttons: [
      [
        {
          text:
            "ایتا",

          url:
            "https://eitaa.com/shoma_shop",

          style:
            "primary"
        },

        {
          text:
            "روبیکا",

          url:
            "https://rubika.ir/shoma_shop",

          style:
            "primary"
        }
      ]
    ]
  },

  productSearch: {
    type: "text",

    text:
      "همه محصولات و قیمت‌های شما شاپ به‌صورت کامل در کانال‌ها قرار گرفته‌اند.\n\n" +
      "برای مشاهده محصولات، موجودی و قیمت‌ها می‌توانید از طریق کانال‌های ایتا و روبیکا اقدام کنید.",

    buttons: [
      [
        {
          text:
            "ایتا",

          url:
            "https://eitaa.com/shoma_shop",

          style:
            "primary"
        },

        {
          text:
            "روبیکا",

          url:
            "https://rubika.ir/shoma_shop",

          style:
            "primary"
        }
      ]
    ]
  },

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
          text:
            "ایتا",

          url:
            "https://eitaa.com/shoma_shop",

          style:
            "primary"
        },

        {
          text:
            "روبیکا",

          url:
            "https://rubika.ir/shoma_shop",

          style:
            "primary"
        }
      ]
    ]
  },

  website: {
    type: "text",

    text:
      "سایت شما شاپ:\n" +
      "<a href=\"https://shoma-shop.ir/\">shoma-shop.ir</a>",

    buttons: [
      [
        {
          text:
            "سایت",

          url:
            "https://shoma-shop.ir/",

          style:
            "primary"
        }
      ]
    ]
  },

  contact: {
    type: "text",

    text:
      "شماره تماس شما شاپ:\n09154819081"
  },

  support: {
    type: "text",

    text:
      "برای پشتیبانی با شماره 09154819081 تماس بگیرید."
  },

  /**
   * پاسخ مربوط به نحوه خرید و ثبت سفارش.
   */
 order: {
  type: "text",

  text:
    "همه محصولات شما شاپ در کانال‌ها قرار گرفته‌اند.\n\n" +
    "محصول موردنظرتون رو از کانال انتخاب کنید و بعد برای خرید و هماهنگی نهایی از طریق پیوی با ما در ارتباط باشید.\n\n" +
    "پرداخت سفارش قبل از ارسال انجام می‌شود.",

  buttons: [
    [
      {
        text:
          "ایتا",

        url:
          "https://eitaa.com/shoma_shop",

        style:
          "primary"
      },

      {
        text:
          "روبیکا",

        url:
          "https://rubika.ir/shoma_shop",

        style:
          "primary"
      }
    ]
  ]
},
