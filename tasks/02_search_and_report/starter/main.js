// @ts-check
// ============================================================
// Task 02: Search and report (starter)
// ============================================================
// The shelf from the task 01 solution is below, so
// you can start here without finishing task 01. Read the brief
// in tasks/02_search_and_report/README.md, then replace each
// todo(...) call with your code.
//
// Run:    node tasks/02_search_and_report/starter/main.js
// Check:  py -3.13 tasks/check/check.py 02 -- node tasks/02_search_and_report/starter/main.js
// ============================================================

/**
 * Placeholder for a step you have not written yet.
 * @param {string} what
 */
function todo(what) {
    console.log(`not implemented: ${what}`);
}

// ------------------------------------------------------------
// From task 01: the shelf (parallel arrays, never resized)
// ------------------------------------------------------------

const SIZE = 10;

/** @type {number[]} */
const ids = Object.seal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
/** @type {string[]} */
const titles = Object.seal([
    "Pride and Prejudice",
    "Nineteen Eighty-Four",
    "The Hobbit",
    "Dune",
    "Robinson Crusoe",
    "The Time Machine",
    "Animal Farm",
    "Emma",
    "The Left Hand of Darkness",
    "Murder on the Orient Express",
]);
/** @type {number[]} */
const years = Object.seal([1813, 1949, 1937, 1965, 1719, 1895, 1945, 1815, 1969, 1934]);
/** @type {number[]} */
const copies = Object.seal([3, 2, 0, 4, 1, 2, 5, 1, 0, 2]);

const SEARCH_TERMS = ["the", "TIME", "zzz"];

// ------------------------------------------------------------
// Core 1: the report table
// ------------------------------------------------------------
// "Report", a header row, a row of dashes, one row per book.
// Widths: ID 2 (right), Title 30 (left), Year 4, Copies 6 (right).
// String(id).padStart(2), title.padEnd(30), "-".repeat(30)

todo("Core 1, the report table");

// ------------------------------------------------------------
// Core 2: search each term in SEARCH_TERMS, ignoring case
// ------------------------------------------------------------
// Collect matches with a while loop into a fixed array plus a count.

todo("Core 2, the searches");

// ------------------------------------------------------------
// Core 3 and 4: words in titles, the longest title
// ------------------------------------------------------------

todo("Core 3, words in titles");
todo("Core 4, the longest title");
