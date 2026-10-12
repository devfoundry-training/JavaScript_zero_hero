// @ts-check
// ============================================================
// Task 09: dates module, calendar days as whole numbers
// ============================================================
// JavaScript has no date-only type, and Date mixes in the local
// time zone: new Date("2026-10-12").getDate() can give 11 in New
// York. So every date here is a DAY NUMBER: whole days since
// 1970-01-01, worked out in UTC where there are no clock changes.
//   * adding days is +, the days between two dates is -
//   * comparing dates is <, === and >
// We only turn a day number back into text to print it.
// ============================================================

const MS_PER_DAY = 24 * 60 * 60 * 1000; // 86400000

/** @typedef {number} Day whole days since 1970-01-01 */

/**
 * "2026-10-12" -> day number. Refuses anything that is not a real
 * date in exactly that form (Date.UTC would quietly turn 2026-02-30
 * into 2 March, so we format the result back and compare).
 * @param {string} text
 * @param {string} [name] what the date is, for the error message
 * @returns {Day}
 */
export function parseDate(text, name = "date") {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
    if (match !== null) {
        const day = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])) / MS_PER_DAY;
        if (formatDate(day) === text) {
            return day;
        }
    }
    throw new RangeError(`${name} must be a date YYYY-MM-DD, got '${text}'`);
}

/**
 * Day number -> "YYYY-MM-DD". toISOString is always UTC.
 * @param {Day} day
 * @returns {string}
 */
export function formatDate(day) {
    return new Date(day * MS_PER_DAY).toISOString().slice(0, 10);
}

/**
 * Day of the week: 0 is Sunday, 6 is Saturday (getUTCDay, never getDay).
 * @param {Day} day
 * @returns {number}
 */
export function weekday(day) {
    return new Date(day * MS_PER_DAY).getUTCDay();
}
