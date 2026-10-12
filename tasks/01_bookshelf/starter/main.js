// @ts-check
// ============================================================
// Task 01: Bookshelf (starter)
// ============================================================
// Read the brief in tasks/01_bookshelf/README.md, then replace
// each todo(...) call with your code.
//
// Run:    node tasks/01_bookshelf/starter/main.js
// Check:  py -3.13 tasks/check/check.py 01 -- node tasks/01_bookshelf/starter/main.js
// ============================================================

/**
 * Placeholder for a step you have not written yet.
 * @param {string} what
 */
function todo(what) {
    console.log(`not implemented: ${what}`);
}

// ------------------------------------------------------------
// Core 1: the shelf, four fixed-size arrays (done for you)
// ------------------------------------------------------------
// Arrays always grow in JavaScript: never push or splice these.

const SIZE = 10;

/** @type {number[]} */
const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
/** @type {string[]} */
const titles = [
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
];
/** @type {number[]} */
const years = [1813, 1949, 1937, 1965, 1719, 1895, 1945, 1815, 1969, 1934];
/** @type {number[]} */
const copies = [3, 2, 0, 4, 1, 2, 5, 1, 0, 2];

// ------------------------------------------------------------
// Core 2-5: the catalogue
// ------------------------------------------------------------
// Print "Catalogue (10 books)", then one line per book:
//   id | title | year | copies text | century [| pre-1950]
// Copies text with if / else, the century with switch on
// Math.floor(year / 100).

todo("Core 2-5, the catalogue");

// ------------------------------------------------------------
// Core 6: "remove" the even ids
// ------------------------------------------------------------
// Copy the odd-id books into a second pair of arrays of size
// SIZE and count the slots used.

todo("Core 6, odd ids only");

// ------------------------------------------------------------
// Core 7: totals
// ------------------------------------------------------------

todo("Core 7, the totals");
