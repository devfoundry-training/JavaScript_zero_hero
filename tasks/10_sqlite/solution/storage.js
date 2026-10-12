// @ts-check
// ============================================================
// Task 10: storage (unchanged from task 09)
// ============================================================
// The CSV loaders from task 09. Task 10 uses them once, to read
// the files for the import into the database.
// ============================================================

import * as fs from "node:fs";
import * as path from "node:path";

import { parseDate } from "./dates.js";
import { Book, Library, Loan, Member, makeBook } from "./library.js";

export const BOOK_FIELDS = ["id", "title", "author", "year", "genre", "copies", "format", "length"];
export const MEMBER_FIELDS = ["id", "name", "email", "type", "joined"];
export const LOAN_FIELDS = ["id", "book_id", "member_id", "borrowed", "returned"];

/** What a load produced: the good rows and the problems. */
export class LoadResult {
    constructor() {
        /** @type {Book[]} */
        this.books = [];
        /** @type {Member[]} */
        this.members = [];
        /** @type {Loan[]} */
        this.loans = [];
        /** @type {string[]} */
        this.problems = [];
        this.skipped = 0;
    }

    /**
     * @param {number} lineNumber
     * @param {string} reason
     */
    skip(lineNumber, reason) {
        this.problems.push(`line ${lineNumber}: ${reason}`);
        this.skipped++;
    }
}

/**
 * @param {string} text
 * @param {string} name
 * @returns {number}
 */
export function wholeNumber(text, name) {
    if (!/^-?[0-9]+$/.test(text)) {
        throw new RangeError(`${name} must be a whole number, got '${text}'`);
    }
    return Number(text);
}

/**
 * [line number, fields] for every data row with the right width.
 * Rows with the wrong width are reported and skipped. Throws the
 * "ENOENT" error when the file is missing.
 * @param {string} file
 * @param {number} width
 * @param {LoadResult} result
 * @returns {Array<[number, string[]]>}
 */
function readRows(file, width, result) {
    /** @type {Array<[number, string[]]>} */
    const rows = [];
    fs.readFileSync(file, "utf8").split(/\r?\n/).forEach((line, index) => {
        const lineNumber = index + 1;
        if (lineNumber === 1 || line === "") {
            return;
        }
        const row = line.split(",");
        if (row.length !== width) {
            result.skip(lineNumber, `expected ${width} fields, found ${row.length}`);
            return;
        }
        rows.push([lineNumber, row]);
    });
    return rows;
}

/**
 * Run one row's checks; a RangeError means "skip this line".
 * @param {LoadResult} result
 * @param {number} lineNumber
 * @param {() => void} work
 */
function tryRow(result, lineNumber, work) {
    try {
        work();
    } catch (error) {
        if (!(error instanceof RangeError)) {
            throw error; // a bug, not bad data
        }
        result.skip(lineNumber, error.message);
    }
}

/**
 * @param {string} file
 * @param {LoadResult} [result] add to this result instead of a new one
 * @returns {LoadResult}
 */
export function loadBooksCsv(file, result = new LoadResult()) {
    /** @type {Set<number>} */
    const seen = new Set();
    for (const [lineNumber, row] of readRows(file, BOOK_FIELDS.length, result)) {
        tryRow(result, lineNumber, () => {
            for (const [i, name] of /** @type {const} */ ([[0, "id"], [3, "year"], [5, "copies"], [7, "length"]])) {
                wholeNumber(row[i], name);
            }
            const book = makeBook(row);
            if (seen.has(book.id)) {
                throw new RangeError(`duplicate book id ${book.id}`);
            }
            seen.add(book.id);
            result.books.push(book);
        });
    }
    return result;
}

/**
 * @param {string} file
 * @param {LoadResult} [result]
 * @returns {LoadResult}
 */
export function loadMembersCsv(file, result = new LoadResult()) {
    for (const [lineNumber, row] of readRows(file, MEMBER_FIELDS.length, result)) {
        tryRow(result, lineNumber, () => {
            parseDate(row[4], "joined"); // checked here, kept as text in Member
            result.members.push(new Member(wholeNumber(row[0], "id"), row[1], row[2], row[3], row[4]));
        });
    }
    return result;
}

/**
 * @param {string} file
 * @param {LoadResult} [result]
 * @returns {LoadResult}
 */
export function loadLoansCsv(file, result = new LoadResult()) {
    for (const [lineNumber, row] of readRows(file, LOAN_FIELDS.length, result)) {
        tryRow(result, lineNumber, () => {
            const returned = row[4] === "" ? null : parseDate(row[4], "returned"); // optional date
            result.loans.push(new Loan(wholeNumber(row[0], "id"), wholeNumber(row[1], "book_id"),
                wholeNumber(row[2], "member_id"), parseDate(row[3], "borrowed"), returned));
        });
    }
    return result;
}

/**
 * @param {LoadResult} result
 * @returns {Library}
 */
export function buildLibrary(result) {
    const library = new Library();
    for (const book of result.books) {
        library.addBook(book);
    }
    for (const member of result.members) {
        library.addMember(member);
    }
    for (const loan of result.loans) {
        library.addLoan(loan);
    }
    return library;
}

/**
 * books.csv, members.csv and loans.csv from one folder.
 * @param {string} data
 * @returns {Library}
 */
export function loadAll(data) {
    const result = new LoadResult();
    loadBooksCsv(path.join(data, "books.csv"), result);
    loadMembersCsv(path.join(data, "members.csv"), result);
    loadLoansCsv(path.join(data, "loans.csv"), result);
    return buildLibrary(result);
}
