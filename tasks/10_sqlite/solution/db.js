// @ts-check
// ============================================================
// Task 10: db module, the library in SQLite
// ============================================================
// node:sqlite is built into Node (22.13 and later). Every query
// uses ? placeholders and passes the values separately. SQLite
// keeps the values apart from the SQL text, so a title like
//   x' OR '1'='1
// is only ever data. Never build SQL by joining strings with input.
// ============================================================

import * as fs from "node:fs";
import { DatabaseSync } from "node:sqlite";

import { formatDate, parseDate } from "./dates.js";
import { Library, Loan, Member, makeBook } from "./library.js";
import { LoadResult } from "./storage.js";

/** @typedef {import("./dates.js").Day} Day */

export class LibraryDb {
    /** @param {string} file */
    constructor(file) {
        this.db = new DatabaseSync(file);
        // SQLite ignores FOREIGN KEY rules unless this is switched on
        this.db.exec("PRAGMA foreign_keys = ON");
    }

    close() {
        this.db.close();
    }

    /**
     * Run work inside one transaction: COMMIT if it finishes,
     * ROLLBACK if it throws (and throw the error on).
     * @template T
     * @param {() => T} work
     * @returns {T}
     */
    transaction(work) {
        this.db.exec("BEGIN");
        try {
            const result = work();
            this.db.exec("COMMIT");
            return result;
        } catch (error) {
            this.db.exec("ROLLBACK");
            throw error;
        }
    }

    // --- setting up ---------------------------------------------

    /**
     * Run schema.sql: it drops and recreates every table.
     * @param {string} schemaFile
     */
    create(schemaFile) {
        this.db.exec(fs.readFileSync(schemaFile, "utf8"));
    }

    /**
     * Copy loaded CSV rows into the tables, in one transaction.
     * @param {LoadResult} result
     */
    importRows(result) {
        const insertBook = this.db.prepare(
            "INSERT INTO books (id, title, author, year, genre, copies, format, length) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        const insertMember = this.db.prepare(
            "INSERT INTO members (id, name, email, type, joined) VALUES (?, ?, ?, ?, ?)");
        const insertLoan = this.db.prepare(
            "INSERT INTO loans (id, book_id, member_id, borrowed, returned) VALUES (?, ?, ?, ?, ?)");
        this.transaction(() => {
            for (const b of result.books) {
                insertBook.run(b.id, b.title, b.author, b.year, b.genre, b.copies, b.formatName, b.length);
            }
            for (const m of result.members) {
                insertMember.run(m.id, m.name, m.email, m.type, m.joined);
            }
            for (const x of result.loans) {
                insertLoan.run(x.id, x.bookId, x.memberId, formatDate(x.borrowed),
                    x.returned === null ? null : formatDate(x.returned));
            }
        });
    }

    /**
     * @param {"books" | "members" | "loans"} table
     * @returns {number}
     */
    count(table) {
        // A table name cannot be a ? parameter, so it is checked
        // against a fixed list instead of trusted
        if (!["books", "members", "loans"].includes(table)) {
            throw new RangeError(`unknown table ${table}`);
        }
        const row = this.db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get();
        return Number(row?.n);
    }

    // --- queries ---------------------------------------------------
    // Rows come back as objects keyed by column name (or AS alias).

    genreCounts() {
        return /** @type {Array<{ genre: string, n: number }>} */ (this.db.prepare(
            "SELECT genre, COUNT(*) AS n FROM books GROUP BY genre ORDER BY genre").all());
    }

    /** Books with nothing on the shelf: copies minus open loans is 0. */
    unavailableBooks() {
        return /** @type {Array<{ id: number, title: string, available: number, copies: number }>} */ (
            this.db.prepare(`
                SELECT b.id, b.title, b.copies - COUNT(l.id) AS available, b.copies
                FROM books b
                LEFT JOIN loans l ON l.book_id = b.id AND l.returned IS NULL
                GROUP BY b.id, b.title, b.copies
                HAVING b.copies - COUNT(l.id) = 0
                ORDER BY b.id`).all());
    }

    /**
     * @param {string} text
     */
    searchTitles(text) {
        // The % wildcards go into the value, not into the SQL
        return /** @type {Array<{ id: number, title: string, year: number }>} */ (this.db.prepare(
            "SELECT id, title, year FROM books WHERE LOWER(title) LIKE ? ORDER BY id")
            .all(`%${text.toLowerCase()}%`));
    }

    openLoansPerMember() {
        return /** @type {Array<{ id: number, name: string, n: number }>} */ (this.db.prepare(`
            SELECT m.id, m.name, COUNT(l.id) AS n
            FROM members m
            LEFT JOIN loans l ON l.member_id = m.id AND l.returned IS NULL
            GROUP BY m.id, m.name
            ORDER BY m.id`).all());
    }

    // --- loading the model and saving changes -----------------------

    /** @returns {Library} */
    loadLibrary() {
        const library = new Library();
        for (const row of this.db.prepare(
            "SELECT id, title, author, year, genre, copies, format, length FROM books ORDER BY id").all()) {
            library.addBook(makeBook([row.id, row.title, row.author, row.year, row.genre, row.copies, row.format,
                row.length].map(String)));
        }
        for (const row of this.db.prepare("SELECT id, name, email, type, joined FROM members ORDER BY id").all()) {
            library.addMember(new Member(Number(row.id), String(row.name), String(row.email), String(row.type),
                String(row.joined)));
        }
        for (const row of this.db.prepare(
            "SELECT id, book_id, member_id, borrowed, returned FROM loans ORDER BY id").all()) {
            library.addLoan(new Loan(Number(row.id), Number(row.book_id), Number(row.member_id),
                parseDate(String(row.borrowed)), row.returned === null ? null : parseDate(String(row.returned))));
        }
        return library;
    }

    /** @param {Loan} loan */
    insertLoan(loan) {
        this.db.prepare("INSERT INTO loans (id, book_id, member_id, borrowed, returned) VALUES (?, ?, ?, ?, NULL)")
            .run(loan.id, loan.bookId, loan.memberId, formatDate(loan.borrowed));
    }

    /** @param {Loan} loan */
    markReturned(loan) {
        if (loan.returned === null) {
            throw new RangeError("loan has not been returned");
        }
        this.db.prepare("UPDATE loans SET returned = ? WHERE id = ?").run(formatDate(loan.returned), loan.id);
    }

    // --- Stretch: the whole borrow inside one transaction ----------

    /**
     * Insert the loan first, then check stock in SQL. If the check
     * fails the transaction rolls back and the insert disappears.
     * @param {number} memberId
     * @param {number} bookId
     * @param {Day} today
     * @returns {number | undefined} the new loan id, or undefined when refused
     */
    borrowInTransaction(memberId, bookId, today) {
        try {
            return this.transaction(() => {
                const newId = Number(this.db.prepare("SELECT COALESCE(MAX(id), 0) + 1 AS n FROM loans").get()?.n);
                this.db.prepare("INSERT INTO loans (id, book_id, member_id, borrowed, returned) VALUES (?, ?, ?, ?, NULL)")
                    .run(newId, bookId, memberId, formatDate(today));
                const out = Number(this.db.prepare(
                    "SELECT COUNT(*) AS n FROM loans WHERE book_id = ? AND returned IS NULL").get(bookId)?.n);
                const copies = Number(this.db.prepare("SELECT copies FROM books WHERE id = ?").get(bookId)?.copies);
                if (out > copies) {
                    throw new RangeError("no copies available"); // transaction() rolls back
                }
                return newId;
            });
        } catch (error) {
            if (error instanceof RangeError) {
                return undefined;
            }
            throw error;
        }
    }
}

// Stretch 2: an index on loans(member_id), for example
//   CREATE INDEX idx_loans_member ON loans (member_id)
// helps "open loans per member": the LEFT JOIN looks up the loans
// for each member by member_id, and the index finds them without
// reading the whole loans table. With 12 rows it makes no
// difference; with a million it does.
