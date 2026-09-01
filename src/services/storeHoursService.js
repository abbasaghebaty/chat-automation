/**
 * سرویس وضعیت ساعت کاری فروشگاه.
 *
 * timezone:
 * Asia/Tehran
 *
 * شنبه تا پنجشنبه:
 * 09:00 تا 14:00
 * 17:00 تا 22:00
 *
 * جمعه:
 * تعطیل
 *
 * وضعیت فقط هنگام درخواست محاسبه می‌شود
 * و هیچ timer یا stateای ندارد.
 */

const TIME_ZONE = "Asia/Tehran";

const SOON_TO_CLOSE_MINUTES = 30;

const WORKING_DAYS = new Set([
  0, // Sunday
  1, // Monday
  2, // Tuesday
  3, // Wednesday
  4, // Thursday
  6  // Saturday
]);

const WEEKDAY_NAMES = {
  0: "یکشنبه",
  1: "دوشنبه",
  2: "سه‌شنبه",
  3: "چهارشنبه",
  4: "پنجشنبه",
  5: "جمعه",
  6: "شنبه"
};

const SHIFTS = [
  {
    start: 9 * 60,
    end: 14 * 60
  },
  {
    start: 17 * 60,
    end: 22 * 60
  }
];

function getTehranParts(
  date = new Date()
) {
  const formatter =
    new Intl.DateTimeFormat("en-US", {
      timeZone: TIME_ZONE,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      hourCycle: "h23"
    });

  const parts =
    formatter.formatToParts(date);

  const values = {};

  for (const part of parts) {
    values[part.type] = part.value;
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
    weekday: weekdayMap[values.weekday],
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second)
  };
}

function toSeconds(
  hour,
  minute,
  second = 0
) {
  return (
    hour * 3600 +
    minute * 60 +
    second
  );
}

function toPersianDigits(value) {
  return String(value).replace(
    /[0-9]/g,
    (digit) =>
      "۰۱۲۳۴۵۶۷۸۹"[
        Number(digit)
      ]
  );
}

function formatTime(totalMinutes) {
  const hour = Math.floor(
    totalMinutes / 60
  );

  const minute =
    totalMinutes % 60;

  return toPersianDigits(
    `${String(hour).padStart(2, "0")}:${String(
      minute
    ).padStart(2, "0")}`
  );
}

function getNextWorkingDay(weekday) {
  let nextWeekday =
    (weekday + 1) % 7;

  while (
    !WORKING_DAYS.has(nextWeekday)
  ) {
    nextWeekday =
      (nextWeekday + 1) % 7;
  }

  return nextWeekday;
}

export function getStoreStatus(
  date = new Date()
) {
  const now = getTehranParts(date);

  const nowSeconds = toSeconds(
    now.hour,
    now.minute,
    now.second
  );

  /**
   * جمعه تعطیل است.
   */
  if (
    !WORKING_DAYS.has(
      now.weekday
    )
  ) {
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
    const startSeconds =
      shift.start * 60;

    const endSeconds =
      shift.end * 60;

    if (
      nowSeconds >= startSeconds &&
      nowSeconds < endSeconds
    ) {
      const remainingSeconds =
        endSeconds - nowSeconds;

      /**
       * اگر کمتر از ۳۰ دقیقه مانده باشد:
       */
      if (
        remainingSeconds <=
        SOON_TO_CLOSE_MINUTES * 60
      ) {
        const remainingMinutes =
          Math.ceil(
            remainingSeconds / 60
          );

        return {
          status: "soon_close",

          title:
            "فروشگاه باز است",

          message:
            `فروشگاه حدود ${toPersianDigits(
              remainingMinutes
            )} دقیقه دیگر بسته می‌شود.\n` +
            `ساعت پایان این شیفت: ${formatTime(
              shift.end
            )}`
        };
      }

      return {
        status: "open",

        title:
          "فروشگاه هم‌اکنون باز است",

        message:
          `این شیفت تا ساعت ${formatTime(
            shift.end
          )} ادامه دارد.`
      };
    }
  }

  /**
   * اگر امروز هنوز شیفت دیگری باقی مانده باشد.
   */
  const nextShiftToday =
    SHIFTS.find(
      (shift) =>
        shift.start * 60 >
        nowSeconds
    );

  if (nextShiftToday) {
    return {
      status: "closed",

      title:
        "فروشگاه در حال حاضر بسته است",

      message:
        `شیفت بعدی امروز از ساعت ${formatTime(
          nextShiftToday.start
        )} شروع می‌شود.`
    };
  }

  /**
   * بعد از آخرین شیفت امروز هستیم.
   */
  const nextWeekday =
    getNextWorkingDay(
      now.weekday
    );

  const nextWeekdayName =
    WEEKDAY_NAMES[nextWeekday];

  return {
    status: "closed",

    title:
      "فروشگاه در حال حاضر بسته است",

    message:
      `شیفت بعدی ${nextWeekdayName} از ساعت ${formatTime(
        SHIFTS[0].start
      )} شروع می‌شود.`
  };
}

export function getStoreStatusPopup() {
  const result =
    getStoreStatus();

  return {
    title: result.title,
    message: result.message
  };
}
