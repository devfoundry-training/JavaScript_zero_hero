// @ts-check
// ============================================================
// Task 08: Persistence (starter)
// ============================================================
// library.js is the task 07 model (from the task 07 solution).
// Write the loaders and savers in storage.js, then the script
// from the brief in tasks/08_persistence/README.md.
//
// Run from the repo root:
//   node tasks/08_persistence/starter/main.js tasks/data
// Check:
//   py -3.13 tasks/check/check.py 08 -- node tasks/08_persistence/starter/main.js tasks/data
// ============================================================

import * as path from "node:path";

import { loadBooksCsv } from "./storage.js";

function main() {
    const args = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
    const data = args[0] ?? "tasks/data";

    try {
        const books = loadBooksCsv(path.join(data, "books.csv"));
        console.log(`Loaded ${books.books.length} books from books.csv`);
    } catch (error) {
        console.log(error instanceof Error ? error.message : String(error));
    }
    console.log("not implemented: save, reload, the missing file and the corrupt file");
}

main();
