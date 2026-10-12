// @ts-check
// ============================================================
// Task 10: dates module (unchanged from task 09)
// ============================================================
// Every date is a DAY NUMBER: whole days since 1970-01-01, in UTC.
// The database keeps dates as text YYYY-MM-DD; db.js converts
// with parseDate and formatDate.
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
