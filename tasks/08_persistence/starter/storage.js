// @ts-check
// ============================================================
// Task 08: storage (starter)
// ============================================================
// Write the CSV and JSON loaders and savers here. A bad line is
// reported as "line N: reason" and skipped; the good lines still
// load (brief, Core 5).
// ============================================================

import * as fs from "node:fs";

import { Book, Library, Member } from "./library.js";

export const BOOK_FIELDS = ["id", "title", "author", "year", "genre", "copies", "format", "length"];

/** What a load produced: the good rows and the problems. */
export class LoadResult {
    constructor() {
        /** @type {Book[]} */
        this.books = [];
        /** @type {Member[]} */
        this.members = [];
        /** @type {string[]} "line N: reason" for each skipped line */
        this.problems = [];
        this.skipped = 0;
    }
}

/**
 * Load books.csv (or a damaged copy). readFileSync throws an error
 * with code "ENOENT" when the file is missing.
 * @param {string} file
 * @returns {LoadResult}
 */
export function loadBooksCsv(file) {
    const text = fs.readFileSync(file, "utf8");
    throw new Error(`not implemented: loadBooksCsv (${text.length} characters read from ${file})`);
}

/**
 * @param {string} file
 * @returns {LoadResult}
 */
export function loadMembersCsv(file) {
    throw new Error(`not implemented: loadMembersCsv(${file})`);
}

/**
 * Write out/books.csv: same header and columns, \n line endings.
 * @param {Library} library
 * @param {string} file
 */
export function saveBooksCsv(library, file) {
    throw new Error(`not implemented: saveBooksCsv(${file})`);
}

/**
 * Write out/library.json in the shape given in the brief.
 * JSON.stringify(document, null, 2) does the formatting.
 * @param {Library} library
 * @param {string} file
 */
export function saveJson(library, file) {
    throw new Error(`not implemented: saveJson(${file})`);
}
