// @ts-check
// ============================================================
// Task 03: Functions and a menu (starter)
// ============================================================
// The shelf from task 02 is below, with eraOf and copiesText
// already written as functions (from the task 01 solution). Turn
// every other feature from tasks 01 and 02 into a function that
// RETURNS its result, then write the menu loop. Read the brief in
// tasks/03_functions/README.md.
//
// Run:    node tasks/03_functions/starter/main.js < tasks/data/input_03.txt
// Check:  py -3.13 tasks/check/check.py 03 -- node tasks/03_functions/starter/main.js
// ============================================================

import * as readline from "node:readline";

const SIZE = 10; // used by your catalogue and stats functions

/** @type {readonly number[]} */
const IDS = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
/** @type {readonly string[]} */
const TITLES = Object.freeze([
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
/** @type {readonly number[]} */
const YEARS = Object.freeze([1813, 1949, 1937, 1965, 1719, 1895, 1945, 1815, 1969, 1934]);
/** @type {readonly number[]} */
const COPIES = Object.freeze([3, 2, 0, 4, 1, 2, 5, 1, 0, 2]);

// ------------------------------------------------------------
// Done for you (from task 01)
// ------------------------------------------------------------

/**
 * @param {number} year
 * @returns {string}
 */
function eraOf(year) {
    switch (Math.floor(year / 100)) {
        case 17: return "18th century";
        case 18: return "19th century";
        case 19: return "20th century";
        case 20: return "21st century";
        default: return "unknown era";
    }
}

/**
 * @param {number} count
 * @returns {string}
 */
function copiesText(count) {
    if (count === 0) {
        return "out of stock";
    }
    if (count === 1) {
        return "1 copy";
    }
    return `${count} copies`;
}

// ------------------------------------------------------------
// Core 1: your functions. Each one returns, only the menu prints.
// ------------------------------------------------------------

/**
 * One catalogue line (task 01 format) for the book at position i.
 * @param {number} i
 * @returns {string}
 */
function catalogueLine(i) {
    // Use IDS, TITLES, YEARS, COPIES with eraOf and copiesText
    throw new Error(`not implemented: catalogueLine(${i})`);
}

/**
 * Titles containing term, ignoring case.
 * @param {string} term
 * @returns {string[]}
 */
function search(term) {
    throw new Error(`not implemented: search("${term}")`);
}

/** @returns {string[]} the report table lines (task 02 format) */
function report() {
    throw new Error("not implemented: report()");
}

// Also needed: wordCount(), longestTitle(), totalCopies(), averageYear()

// ------------------------------------------------------------
// Reading input: one line at a time (done for you)
// ------------------------------------------------------------

const input = readline.createInterface({ input: process.stdin });
const lines = input[Symbol.asyncIterator]();

/**
 * The next line of input, or undefined at the end of the input.
 * Core 4: trim it and echo it as "> TEXT".
 * @returns {Promise<string | undefined>}
 */
async function readLine() {
    const next = await lines.next();
    return next.done ? undefined : next.value;
}

// ------------------------------------------------------------
// Core 2-5: the menu loop
// ------------------------------------------------------------

async function runMenu() {
    console.log("Library Manager");
    // Each time round: print the menu line, readLine(), act on the choice.
    // Compare the choice as text ("1", not 1). "0" or the end of input stops.
    console.log("not implemented: the menu loop");
    console.log("Goodbye");
    input.close();
}

await runMenu();
