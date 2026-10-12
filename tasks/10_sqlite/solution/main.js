// @ts-check
// ============================================================
// Task 10: SQLite storage (solution, Core + Stretch)
// ============================================================
// Session 10: databases. Builds on task 09: the CSV files are
// imported once into out/library.db (rebuilt on every run from
// data/schema.sql), and from then on the database is the store.
//
// Run:  node tasks/10_sqlite/solution/main.js DATA_DIR [TODAY]             (Core, checked)
//       node tasks/10_sqlite/solution/main.js DATA_DIR [TODAY] --stretch   (Core, then Stretch)
// Run from the repo root: it writes out/library.db.
// ============================================================

import * as fs from "node:fs";
import * as path from "node:path";

import { formatDate, parseDate } from "./dates.js";
import { LibraryDb } from "./db.js";
import { Library, LibraryError, formatMoney, plural } from "./library.js";
import { LoadResult, loadBooksCsv, loadLoansCsv, loadMembersCsv } from "./storage.js";

const DEFAULT_TODAY = "2026-10-12";
const DB_FILE = path.join("out", "library.db");

/** @typedef {import("./dates.js").Day} Day */

/**
 * Exactly the task 09 report, now fed from the database.
 * @param {Library} library
 * @param {Day} today
 */
function overdueReport(library, today) {
    const overdue = library.overdue(today);
    console.log(`Overdue on ${formatDate(today)}: ${plural(overdue.length, "loan", "loans")}`);
    for (const loan of overdue) {
        const book = library.book(loan.bookId);
        const member = library.member(loan.memberId);
        console.log(`${plural(library.daysLate(loan, today), "day", "days")}: ${book.title}, ${member.name} `
            + `(${member.type}), due ${formatDate(library.dueDate(loan))}, `
            + `fine ${formatMoney(library.fine(loan, today))}`);
    }
}

function main() {
    const args = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
    const data = args[0] ?? "tasks/data";
    const today = parseDate(args[1] ?? DEFAULT_TODAY, "today");

    // ------------------------------------------------------------
    // Core 2 and 3: a fresh database from schema.sql, filled from the CSVs
    // ------------------------------------------------------------
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.rmSync(DB_FILE, { force: true }); // start clean so every run is the same
    const db = new LibraryDb(DB_FILE);
    try {
        db.create(path.join(data, "schema.sql"));
        console.log("Created out/library.db from schema.sql");
        const rows = new LoadResult();
        loadBooksCsv(path.join(data, "books.csv"), rows);
        loadMembersCsv(path.join(data, "members.csv"), rows);
        loadLoansCsv(path.join(data, "loans.csv"), rows);
        db.importRows(rows);
        console.log(`Imported ${db.count("books")} books, ${db.count("members")} members, ${db.count("loans")} loans`);

        // ------------------------------------------------------------
        // Core 4: questions answered in SQL
        // ------------------------------------------------------------
        console.log("Books per genre");
        for (const { genre, n } of db.genreCounts()) {
            console.log(`${genre}: ${n}`);
        }

        console.log("Nothing on the shelf");
        for (const { id, title, available, copies } of db.unavailableBooks()) {
            console.log(`#${id} ${title}: ${available} of ${copies} available`);
        }

        for (const text of ["the", "x' OR '1'='1"]) {
            const found = db.searchTitles(text);
            console.log(`Search "${text}": ${plural(found.length, "book", "books")}`);
            for (const { id, title, year } of found) {
                console.log(`  #${id} ${title} (${year})`);
            }
        }

        console.log("Open loans per member");
        for (const { id, name, n } of db.openLoansPerMember()) {
            console.log(`#${id} ${name}: ${n}`);
        }

        // ------------------------------------------------------------
        // Core 5: the task 09 rules decide, the database remembers
        // ------------------------------------------------------------
        const library = db.loadLibrary();
        console.log(`New loans on ${formatDate(today)}`);
        const actions = /** @type {const} */ ([["borrow", 105, 15], ["borrow", 105, 16], ["return", 102, 14]]);
        for (const [action, memberId, bookId] of actions) {
            try {
                if (action === "borrow") {
                    const loan = library.borrow(memberId, bookId, today);
                    db.insertLoan(loan);
                    console.log(`OK: ${library.member(memberId).name} borrowed ${library.book(bookId).title}, `
                        + `due ${formatDate(library.dueDate(loan))}, saved as loan ${loan.id}`);
                } else {
                    const loan = library.returnBook(memberId, bookId, today);
                    db.markReturned(loan);
                    console.log(`OK: ${library.member(memberId).name} returned ${library.book(bookId).title}, `
                        + `fine ${formatMoney(library.fine(loan, today))}, saved`);
                }
            } catch (error) {
                if (!(error instanceof LibraryError)) {
                    throw error;
                }
                console.log(`Error: ${error.message}`);
            }
        }

        // ------------------------------------------------------------
        // Core 6: read everything back from the database to prove it was saved
        // ------------------------------------------------------------
        const reloaded = db.loadLibrary();
        const openLoans = reloaded.allLoans().filter((loan) => loan.isOpen).length;
        console.log(`Reloaded: ${reloaded.bookCount} books, ${reloaded.memberCount} members, `
            + `${reloaded.loanCount} loans (${openLoans} open)`);
        overdueReport(reloaded, today);

        // ------------------------------------------------------------
        // Stretch: a borrow that rolls back
        // ------------------------------------------------------------
        if (process.argv.includes("--stretch")) {
            console.log("Stretch");
            const before = db.count("loans");
            const refused = db.borrowInTransaction(101, 3, today);
            console.log(`borrow 101 3 in a transaction: ${refused === undefined ? "refused, rolled back" : "OK"}`);
            console.log(`loans before ${before}, after ${db.count("loans")}`);
            const newId = db.borrowInTransaction(101, 4, today);
            console.log(`borrow 101 4 in a transaction: saved as loan ${newId}`);
        }
    } finally {
        db.close();
    }
}

main();
