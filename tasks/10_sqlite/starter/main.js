// @ts-check
// ============================================================
// Task 10: SQLite storage (starter)
// ============================================================
// library.js, storage.js and dates.js are the task 09 solution.
// db.js creates the database from schema.sql; fill in the rest,
// then the script from the brief in tasks/10_sqlite/README.md.
//
// Run from the repo root (it writes out/library.db):
//   node tasks/10_sqlite/starter/main.js tasks/data [TODAY]
// Check:
//   py -3.13 tasks/check/check.py 10 -- node tasks/10_sqlite/starter/main.js tasks/data
// ============================================================

import * as fs from "node:fs";
import * as path from "node:path";

import { LibraryDb } from "./db.js";

const DB_FILE = path.join("out", "library.db");

function main() {
    const args = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
    const data = args[0] ?? "tasks/data";

    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.rmSync(DB_FILE, { force: true }); // start clean so every run is the same
    const db = new LibraryDb(DB_FILE);
    try {
        db.create(path.join(data, "schema.sql"));
        console.log("Created out/library.db from schema.sql");
        console.log("not implemented: the import, the SQL questions and the new loans");
    } finally {
        db.close();
    }
}

main();
