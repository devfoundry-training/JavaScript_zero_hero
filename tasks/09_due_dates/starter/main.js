// @ts-check
// ============================================================
// Task 09: Loans with due dates (starter)
// ============================================================
// library.js and storage.js are the task 08 solution. Add a Loan
// class and the date rules to library.js, a loans.csv loader to
// storage.js, the day-number helpers to dates.js, then print the
// reports from the brief in tasks/09_due_dates/README.md.
//
// Run:    node tasks/09_due_dates/starter/main.js tasks/data [TODAY]
// Check:  py -3.13 tasks/check/check.py 09 -- node tasks/09_due_dates/starter/main.js tasks/data
// ============================================================

import * as path from "node:path";

import { parseDate } from "./dates.js";
import { buildLibrary, loadBooksCsv, loadMembersCsv } from "./storage.js";

const DEFAULT_TODAY = "2026-10-12";

function main() {
    const args = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
    const data = args[0] ?? "tasks/data";
    const todayText = args[1] ?? DEFAULT_TODAY; // never the real clock

    const result = loadBooksCsv(path.join(data, "books.csv"));
    result.members = loadMembersCsv(path.join(data, "members.csv")).members;
    const library = buildLibrary(result);
    console.log(`Loaded ${library.bookCount} books and ${library.memberCount} members (loans.csv not loaded yet)`);

    try {
        console.log(`Today is day ${parseDate(todayText)}`);
    } catch (error) {
        console.log(error instanceof Error ? error.message : String(error));
    }
    console.log("not implemented: the loans table, overdue report, fines and new loans");
}

main();
