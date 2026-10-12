// @ts-check
// ============================================================
// Task 08: storage, CSV and JSON in and out
// ============================================================
// Loading never crashes on bad data. A bad line is reported as
// "line N: reason" and skipped; the good lines still load.
// A missing file is NOT handled here: readFileSync throws an
// error with code "ENOENT" and the caller decides what to do.
// ============================================================

import * as fs from "node:fs";
import * as path from "node:path";

import { Book, Library, Member, makeBook } from "./library.js";

export const BOOK_FIELDS = ["id", "title", "author", "year", "genre", "copies", "format", "length"];
export const MEMBER_FIELDS = ["id", "name", "email", "type", "joined"];

/** A file we could read, but whose contents are not what we expected. */
export class FileFormatError extends Error {
    /**
     * @param {string} message
     * @param {ErrorOptions} [options]
     */
    constructor(message, options) {
        super(message, options);
        this.name = "FileFormatError";
    }
}

/** What a load produced: the good rows and the problems. */
export class LoadResult {
    constructor() {
        /** @type {Book[]} */
        this.books = [];
        /** @type {Member[]} */
        this.members = [];
        /** @type {Array<[number, number]>} [member id, book id] pairs from the JSON */
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
 * Digits with an optional minus sign, nothing else. Number() alone
 * would turn "" into 0 and " 4" into 4, so we check the shape first.
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
 * The lines of a text file. Splitting on \r?\n copes with Windows
 * line endings; a final newline leaves one empty line at the end,
 * which the loaders skip like any blank line.
 * @param {string} file
 * @returns {string[]}
 */
function readLines(file) {
    return fs.readFileSync(file, "utf8").split(/\r?\n/);
}

// ------------------------------------------------------------
// Reading CSV
// ------------------------------------------------------------

/**
 * @param {string} file
 * @returns {LoadResult}
 */
export function loadBooksCsv(file) {
    const result = new LoadResult();
    /** @type {Set<number>} */
    const seen = new Set();
    readLines(file).forEach((line, index) => {
        const lineNumber = index + 1; // people count lines from 1
        if (lineNumber === 1 || line === "") { // the header, or a blank line
            return;
        }
        const row = line.split(",");
        if (row.length !== BOOK_FIELDS.length) {
            result.skip(lineNumber, `expected ${BOOK_FIELDS.length} fields, found ${row.length}`);
            return;
        }
        /** @type {Book} */
        let book;
        try {
            for (const [i, name] of /** @type {const} */ ([[0, "id"], [3, "year"], [5, "copies"], [7, "length"]])) {
                wholeNumber(row[i], name);
            }
            book = makeBook(row);
        } catch (error) {
            if (!(error instanceof RangeError)) {
                throw error; // a bug, not bad data
            }
            result.skip(lineNumber, error.message);
            return;
        }
        if (seen.has(book.id)) {
            result.skip(lineNumber, `duplicate book id ${book.id}`);
            return;
        }
        seen.add(book.id);
        result.books.push(book);
    });
    return result;
}

/**
 * @param {string} file
 * @returns {LoadResult}
 */
export function loadMembersCsv(file) {
    const result = new LoadResult();
    /** @type {Set<number>} */
    const seen = new Set();
    readLines(file).forEach((line, index) => {
        const lineNumber = index + 1;
        if (lineNumber === 1 || line === "") {
            return;
        }
        const row = line.split(",");
        if (row.length !== MEMBER_FIELDS.length) {
            result.skip(lineNumber, `expected ${MEMBER_FIELDS.length} fields, found ${row.length}`);
            return;
        }
        try {
            const member = new Member(wholeNumber(row[0], "id"), row[1], row[2], row[3], row[4]);
            if (seen.has(member.id)) {
                result.skip(lineNumber, `duplicate member id ${member.id}`);
                return;
            }
            seen.add(member.id);
            result.members.push(member);
        } catch (error) {
            if (!(error instanceof RangeError)) {
                throw error;
            }
            result.skip(lineNumber, error.message);
        }
    });
    return result;
}

// ------------------------------------------------------------
// Writing CSV and JSON
// ------------------------------------------------------------

/**
 * @param {Book} book
 * @returns {Array<number | string>}
 */
function bookRow(book) {
    return [book.id, book.title, book.author, book.year, book.genre, book.copies, book.formatName, book.length];
}

/** @param {Book} book */
function bookObject(book) {
    const row = bookRow(book);
    return Object.fromEntries(BOOK_FIELDS.map((name, i) => [name, row[i]]));
}

/** @param {Member} member */
function memberObject(member) {
    return {
        id: member.id,
        name: member.name,
        email: member.email,
        type: member.type,
        joined: member.joined,
        loans: [...member.loans],
    };
}

/**
 * Write the books as CSV with \n line endings: the same bytes on
 * Windows, macOS and Linux.
 * @param {Library} library
 * @param {string} file
 */
export function saveBooksCsv(library, file) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const lines = [BOOK_FIELDS.join(",")];
    for (const book of library.allBooks()) {
        lines.push(bookRow(book).join(","));
    }
    fs.writeFileSync(file, lines.join("\n") + "\n", "utf8");
}

/**
 * @param {Library} library
 * @param {string} file
 */
export function saveJson(library, file) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const document = {
        books: library.allBooks().map(bookObject),
        members: library.allMembers().map(memberObject),
    };
    fs.writeFileSync(file, JSON.stringify(document, null, 2) + "\n", "utf8");
}

/**
 * Stretch: read the JSON back. Throws the "ENOENT" error for a
 * missing file, or FileFormatError for broken JSON.
 * @param {string} file
 * @returns {LoadResult}
 */
export function loadJson(file) {
    const text = fs.readFileSync(file, "utf8");
    /** @type {any} */
    let document;
    try {
        document = JSON.parse(text);
    } catch (error) {
        throw new FileFormatError("not valid JSON", { cause: error });
    }
    const result = new LoadResult();
    try {
        for (const item of document.books) {
            result.books.push(makeBook(BOOK_FIELDS.map((name) => String(item[name]))));
        }
        for (const item of document.members) {
            result.members.push(new Member(item.id, item.name, item.email, item.type, item.joined));
            for (const bookId of item.loans ?? []) {
                result.loans.push([item.id, bookId]);
            }
        }
    } catch (error) {
        throw new FileFormatError("not a library file", { cause: error });
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
    // Saved loans go back through borrow(), so the copy counts and
    // the limits are checked exactly as if they were new loans
    for (const [memberId, bookId] of result.loans) {
        library.borrow(memberId, bookId);
    }
    return library;
}
