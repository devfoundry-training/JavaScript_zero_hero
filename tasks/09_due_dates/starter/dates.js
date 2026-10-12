// @ts-check
// ============================================================
// Task 09: dates module (starter)
// ============================================================
// JavaScript has no date-only type, and Date mixes in the local
// time zone. Turn every date into a DAY NUMBER (whole days since
// 1970-01-01, in UTC) and do all the maths on day numbers:
//   Date.UTC(y, m - 1, d) / MS_PER_DAY            text -> day number
//   new Date(day * MS_PER_DAY).toISOString()      day number -> text
// Never use the local-time getters such as getDate().
// ============================================================

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** @typedef {number} Day whole days since 1970-01-01 */

/**
 * "2026-10-12" -> day number.
 * @param {string} text
 * @returns {Day}
 */
export function parseDate(text) {
    throw new Error(`not implemented: parseDate("${text}") (MS_PER_DAY is ${MS_PER_DAY})`);
}

/**
 * Day number -> "YYYY-MM-DD".
 * @param {Day} day
 * @returns {string}
 */
export function formatDate(day) {
    throw new Error(`not implemented: formatDate(${day})`);
}
