// @ts-check
// ============================================================
// Task 10: db module (starter)
// ============================================================
// node:sqlite is built into Node (22.13 and later):
//   const db = new DatabaseSync(file);
//   db.exec(sql)                          runs one or many statements
//   db.prepare(sql).run(a, b)             INSERT / UPDATE with ? placeholders
//   db.prepare(sql).all(a) / .get(a)      SELECT: rows as objects
// Parameterised queries only: never join values into SQL text.
// ============================================================

import * as fs from "node:fs";
import { DatabaseSync } from "node:sqlite";

import { Library } from "./library.js";

export class LibraryDb {
    /** @param {string} file */
    constructor(file) {
        this.db = new DatabaseSync(file);
        this.db.exec("PRAGMA foreign_keys = ON"); // SQLite ignores FOREIGN KEY rules without this
    }

    close() {
        this.db.close();
    }

    /**
     * Run schema.sql (it drops and recreates every table).
     * @param {string} schemaFile
     */
    create(schemaFile) {
        this.db.exec(fs.readFileSync(schemaFile, "utf8"));
    }

    /**
     * Core 3: insert the CSV rows with parameterised INSERTs, in one transaction.
     * @param {import("./storage.js").LoadResult} result
     */
    importRows(result) {
        throw new Error(`not implemented: importRows (${result.books.length} books ready)`);
    }

    /**
     * Core 5: build the task 09 model from the tables.
     * @returns {Library}
     */
    loadLibrary() {
        throw new Error("not implemented: loadLibrary");
    }
}
