// @ts-check
// ============================================================
// Task 09: Loans with due dates (solution, Core + Stretch)
// ============================================================
// Session 9: dates and times. Builds on task 08.
// "Today" is an input, never the real clock, so the output is the
// same whenever and wherever it runs.
//
// Run:  node tasks/09_due_dates/solution/main.js DATA_DIR [TODAY]             (Core, checked)
//       node tasks/09_due_dates/solution/main.js DATA_DIR [TODAY] --stretch   (Core, then Stretch)
// DATA_DIR defaults to tasks/data, TODAY to 2026-10-12.
// ============================================================

import { formatDate, parseDate, weekday } from "./dates.js";
import { Library, LibraryError, formatMoney, plural } from "./library.js";
import { loadAll } from "./storage.js";

const DEFAULT_TODAY = "2026-10-12";

/** @typedef {import("./dates.js").Day} Day */

/**
 * @param {Library} library
 * @param {Day} today
 */
function loansTable(library, today) {
    console.log("Loans");
    console.log(`${"ID".padStart(2)}  ${"Book".padEnd(30)}  ${"Member".padEnd(12)}  ${"Borrowed".padEnd(10)}  `
        + `${"Due".padEnd(10)}  Status`);
    console.log(["-".repeat(2), "-".repeat(30), "-".repeat(12), "-".repeat(10), "-".repeat(10), "-".repeat(6)]
        .join("  "));
    for (const loan of library.allLoans()) {
        const book = library.book(loan.bookId);
        const member = library.member(loan.memberId);
        console.log(`${String(loan.id).padStart(2)}  ${book.title.padEnd(30)}  ${member.name.padEnd(12)}  `
            + `${formatDate(loan.borrowed)}  ${formatDate(library.dueDate(loan))}  ${library.status(loan, today)}`);
    }
}

/**
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

/**
 * @param {Library} library
 * @param {Day} today
 */
function finesReport(library, today) {
    let onOverdue = 0;
    let onReturns = 0;
    for (const loan of library.allLoans()) {
        if (loan.isOpen) {
            onOverdue += library.fine(loan, today);
        } else {
            onReturns += library.fine(loan, today);
        }
    }
    console.log("Fines");
    console.log(`on overdue loans: ${formatMoney(onOverdue)}`);
    console.log(`on late returns: ${formatMoney(onReturns)}`);
}

/**
 * @param {Library} library
 * @param {Day} today
 */
function newLoans(library, today) {
    console.log(`New loans on ${formatDate(today)}`);
    const actions = /** @type {const} */ ([["borrow", 105, 15], ["borrow", 105, 16], ["return", 102, 14]]);
    for (const [action, memberId, bookId] of actions) {
        try {
            const name = library.member(memberId).name;
            const title = library.book(bookId).title;
            if (action === "borrow") {
                const loan = library.borrow(memberId, bookId, today);
                console.log(`OK: ${name} borrowed ${title}, due ${formatDate(library.dueDate(loan))}`);
            } else {
                const loan = library.returnBook(memberId, bookId, today);
                const late = library.daysLate(loan, today);
                const tail = late === 0
                    ? "on time"
                    : `${plural(late, "day", "days")} late, fine ${formatMoney(library.fine(loan, today))}`;
                console.log(`OK: ${name} returned ${title}, ${tail}`);
            }
        } catch (error) {
            if (!(error instanceof LibraryError)) {
                throw error;
            }
            console.log(`Error: ${error.message}`);
        }
    }
}

// ------------------------------------------------------------
// Stretch: closed on Sundays, and what is due this week
// ------------------------------------------------------------

/**
 * The library is closed on Sundays: a Sunday due date moves to
 * Monday. weekday() counts Sunday as 0.
 * @param {Day} day
 * @returns {Day}
 */
function openDay(day) {
    return weekday(day) === 0 ? day + 1 : day;
}

/**
 * @param {Library} library
 * @param {Day} today
 */
function stretch(library, today) {
    console.log("Stretch");
    for (const loan of library.allLoans()) {
        const due = library.dueDate(loan);
        if (openDay(due) !== due) {
            console.log(`loan ${loan.id}: due ${formatDate(due)} is a Sunday, moves to ${formatDate(openDay(due))}`);
        }
    }
    const weekEnd = today + 7;
    const dueSoon = library.allLoans().filter((loan) => loan.isOpen
        && library.dueDate(loan) >= today && library.dueDate(loan) <= weekEnd);
    console.log(`Due by ${formatDate(weekEnd)}: ${dueSoon.map((loan) => library.book(loan.bookId).title).join(", ")}`);
}

function main() {
    const args = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
    const data = args[0] ?? "tasks/data";
    const today = parseDate(args[1] ?? DEFAULT_TODAY, "today");

    const library = loadAll(data);
    console.log(`Today is ${formatDate(today)}`);
    loansTable(library, today);
    overdueReport(library, today);
    finesReport(library, today);
    newLoans(library, today);
    if (process.argv.includes("--stretch")) {
        stretch(library, today);
    }
}

main();
