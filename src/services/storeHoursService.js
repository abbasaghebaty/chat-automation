/**
 * ============================================================
 * سرویس وضعیت ساعت کاری فروشگاه
 * ============================================================
 *
 * این فایل مسئول محاسبه وضعیت فروشگاه در «لحظه درخواست» است.
 *
 * نکات مهم:
 * - ساعت همیشه بر اساس Asia/Tehran محاسبه می‌شود.
 * - شنبه تا پنجشنبه دو شیفت داریم:
 *   09:00 تا 14:00
 *   17:00 تا 22:00
 * - جمعه تعطیل است.
 * - این سرویس هیچ state یا timerای ندارد.
 * - هر بار که دکمه بررسی زده شود، وضعیت از نو محاسبه می‌شود.
 *
 * بنابراین:
 * پیام ربات زنده نیست؛ فقط هنگام کلیک، وضعیت همان لحظه محاسبه می‌شود.
 * ============================================================
 */

const TIME_ZONE = "Asia/Tehran";

/**
 * روزهای کاری فروشگاه.
 *
 * JavaScript:
 * 0 = Sunday
 * 1 = Monday
 * ...
 * 6 = Saturday
 *
 * ما اینجا به‌صورت صریح روزهای کاری را مشخص می‌کنیم.
 */
const WORKING_DAYS = new Set([
  0, // Sunday
  1, // Monday
  2, // Tuesday
  3, // Wednesday
  4, // Thursday
  6  // Saturday
]);

/**
 * شیفت‌های فروشگاه بر حسب دقیقه از ابتدای روز.
 */
const SHIFTS = [
  {
    start: 9 * 60,
    end: 14 * 60,
    label: "۹:۰۰ تا ۱۴:۰۰"
  },
  {
    start: 17 * 60,
    end: 22 * 60,
    label: "۱۷:۰۰ تا ۲۲:۰۰"
  }
];

/**
 * آستانه «به‌زودی بسته می‌شود».
 *
 * اگر کمتر یا مساوی ۳۰ دقیقه تا پایان شیفت باقی مانده باشد،
 * وضعیت جداگانه نمایش داده می‌شود.
 */
const SOON_TO_CLOSE_MINUTES = 30;

/**
 * ------------------------------------------------------------
 * تبدیل ساعت تهران به اجزای قابل استفاده
 * ------------------------------------------------------------
 */
function getTehranParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  const parts = formatter.formatToParts(date);

  const result = {};

  for (const part of parts) {
    result[part.type] = part.value;
  }

  const weekdayMap = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6
  };

  return {
    weekday: weekdayMap[result.weekday],
    hour: Number(result.hour),
    minute: Number(result.minute),
    second: Number(result.second)
  };
}

/**
 * ------------------------------------------------------------
 * تبدیل ساعت به دقیقه
 * ------------------------------------------------------------
 */
function toMinutes(hour, minute) {
  return hour * 60 + minute;
}

/**
 * ------------------------------------------------------------
 * نمایش ساعت به شکل فارسی
 * ------------------------------------------------------------
 */
function formatTime(totalMinutes) {
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

/**
 * ------------------------------------------------------------
 * تبدیل عددهای انگلیسی به فارسی
 *
 * فقط برای خروجی متنی تلگرام استفاده می‌شود.
 * ------------------------------------------------------------
 */
function toPersianDigits(value) {
  return String(value).replace(/[0-9]/g, (digit) => {
    return "۰۱۲۳۴۵۶۷۸۹"[Number(digit)];
  });
}

/**
 * ------------------------------------------------------------
 * محاسبه وضعیت فروشگاه
 * ------------------------------------------------------------
 */
export function getStoreStatus(date = new Date()) {
  const now = getTehranParts(date);
  const nowMinutes = toMinutes(now.hour, now.minute);

  /**
   * جمعه تعطیل است.
   */
  if (!WORKING_DAYS.has(now.weekday)) {
    return {
      status: "closed",
      title: "فروشگاه امروز تعطیل است",
      message:
        "امروز جمعه است و فروشگاه تعطیل می‌باشد."
    };
  }

  /**
   * بررسی شیفت جاری.
   */
  for (const shift of SHIFTS) {
    if (nowMinutes >= shift.start && nowMinutes < shift.end) {
      const remainingMinutes = shift.end - nowMinutes;

      /**
       * نزدیک شدن به پایان شیفت.
       */
      if (remainingMinutes <= SOON_TO_CLOSE_MINUTES) {
        return {
          status: "soon_close",
          title: "فروشگاه باز است",
          message:
            `فروشگاه تا حدود ${toPersianDigits(remainingMinutes)} دقیقه دیگر بسته می‌شود.\n` +
            `ساعت پایان این شیفت: ${toPersianDigits(formatTime(shift.end))}`
        };
      }

      return {
        status: "open",
        title: "فروشگاه هم‌اکنون باز است",
        message:
          `این شیفت تا ساعت ${toPersianDigits(formatTime(shift.end))} ادامه دارد.`
      };
    }
  }

  /**
   * ----------------------------------------------------------
   * فروشگاه فعلاً بسته است.
   *
   * ابتدا بررسی می‌کنیم آیا شیفت دیگری در همین روز داریم یا نه.
   * ----------------------------------------------------------
   */
  const nextShiftToday = SHIFTS.find(
    (shift) => shift.start > nowMinutes
  );

  if (nextShiftToday) {
    return {
      status: "closed",
      title: "فروشگاه در حال حاضر بسته است",
      message:
        `شیفت بعدی امروز از ساعت ${toPersianDigits(
          formatTime(nextShiftToday.start)
        )} شروع می‌شود.`
    };
  }

  /**
   * بعد از پایان آخرین شیفت هستیم.
   *
   * شیفت بعدی، فردا صبح نیست اگر فردا جمعه باشد.
   * برای سادگی و دقت، روز بعدی کاری را پیدا می‌کنیم.
   */
  let nextWeekday = (now.weekday + 1) % 7;

  while (!WORKING_DAYS.has(nextWeekday)) {
    nextWeekday = (nextWeekday + 1) % 7;
  }

  /**
   * اگر شنبه باشد، یعنی شیفت بعدی فرداست.
   * در غیر این صورت هم چون از آخرین شیفت امروز عبور کرده‌ایم،
   * اولین شیفت روز کاری بعدی را اعلام می‌کنیم.
   */
  return {
    status: "closed",
    title: "فروشگاه در حال حاضر بسته است",
    message:
      `شیفت بعدی از ساعت ${toPersianDigits(
        formatTime(SHIFTS[0].start)
      )} در روز کاری بعدی شروع می‌شود.`
  };
}

/**
 * ============================================================
 * متن نهایی popup
 *
 * این تابع را handler استفاده می‌کند تا ساختار پیام
 * متمرکز و قابل نگهداری بماند.
 * ============================================================
 */
export function getStoreStatusPopup() {
  const result = getStoreStatus();

  return {
    title: result.title,
    message: result.message
  };
}
