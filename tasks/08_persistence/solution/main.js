// @ts-check
// ============================================================
// Task 08: Persistence (solution, Core + Stretch)
// ============================================================
// Session 8: file I/O. Builds on task 07: the data now comes from
// the files in the data folder, and the library is saved to CSV
// and JSON in a folder called out (made in the current folder).
// Core reads the CSV back; reading the JSON back is the Stretch.
//
// Run from the repo root:
//   node tasks/08_persistence/solution/main.js tasks/data             (Core, checked)
//   node tasks/08_persistence/solution/main.js tasks/data --stretch   (Core, then Stretch)
// The data folder defaults to tasks/data.
// ============================================================

import * as path from "node:path";

import { Library } from "./library.js";
import {
    FileFormatError, LoadResult, buildLibrary, loadBooksCsv, loadJson, loadMembersCsv, saveBooksCsv, saveJson,
} from "./storage.js";

const OUT = "out";

/**
 * Same ids with the same field values, in the same order.
 * @param {Library} a
 * @param {Library} b
 * @returns {boolean}
 */
function sameBooks(a, b) {
    /** @param {Library} library */
    const rows = (library) => JSON.stringify(library.allBooks().map((x) =>
        [x.id, x.title, x.author, x.year, x.genre, x.copies, x.formatName, x.length]));
    return rows(a) === rows(b);
}

/**
 * @param {Library} a
 * @param {Library} b
 * @returns {boolean}
 */
function sameMembers(a, b) {
    /** @param {Library} library */
    const rows = (library) => JSON.stringify(library.allMembers().map((m) =>
        [m.id, m.name, m.email, m.type, m.joined, m.loans]));
    return rows(a) === rows(b);
}

/**
 * Is this the error readFileSync throws for a missing file?
 * @param {unknown} error
 * @returns {boolean}
 */
function isMissingFile(error) {
    return error instanceof Error && "code" in error && error.code === "ENOENT";
}

/**
 * Load a file that might be missing or broken, and say what happened.
 * @param {string} name
 * @param {(file: string) => LoadResult} loader
 * @param {string} file
 */
function tryLoad(name, loader, file) {
    console.log(`Loading ${name}`);
    /** @type {LoadResult} */
    let result;
    try {
        result = loader(file);
    } catch (error) {
        if (isMissingFile(error)) {
            console.log("  file not found, starting with an empty catalogue");
            return;
        }
        if (error instanceof FileFormatError) {
            console.log(`  ${error.message}, starting with an empty catalogue`);
            return;
        }
        throw error;
    }
    for (const problem of result.problems) {
        console.log(`  ${problem}`);
    }
    console.log(`  loaded ${result.books.length} books, skipped ${result.skipped} lines`);
}

function main() {
    const args = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
    const data = args[0] ?? "tasks/data";

    // ------------------------------------------------------------
    // Core 1: load the real data from disk
    // ------------------------------------------------------------
    const books = loadBooksCsv(path.join(data, "books.csv"));
    const members = loadMembersCsv(path.join(data, "members.csv"));
    console.log(`Loaded ${books.books.length} books from books.csv`);
    console.log(`Loaded ${members.members.length} members from members.csv`);
    books.members = members.members;
    const library = buildLibrary(books);

    // ------------------------------------------------------------
    // Core 2 and 3: save as CSV and JSON, then load the CSV back
    // ------------------------------------------------------------
    // path.join uses \ on Windows; the messages always show /
    saveBooksCsv(library, path.join(OUT, "books.csv"));
    console.log(`Saved ${library.bookCount} books to out/books.csv`);
    saveJson(library, path.join(OUT, "library.json"));
    console.log(`Saved ${library.bookCount} books and ${library.memberCount} members to out/library.json`);

    const fromCsv = buildLibrary(loadBooksCsv(path.join(OUT, "books.csv")));
    const verdict = sameBooks(library, fromCsv) ? "same as before" : "DIFFERENT";
    console.log(`Reloaded out/books.csv: ${fromCsv.bookCount} books, ${verdict}`);

    // ------------------------------------------------------------
    // Core 4 and 5: a missing file and a corrupt CSV
    // ------------------------------------------------------------
    tryLoad("missing.csv", loadBooksCsv, path.join(data, "missing.csv"));
    tryLoad("books_corrupt.csv", loadBooksCsv, path.join(data, "books_corrupt.csv"));

    // ------------------------------------------------------------
    // Stretch: read the JSON back, cope with broken JSON, and keep
    // loans across a restart
    // ------------------------------------------------------------
    if (process.argv.includes("--stretch")) {
        console.log("Stretch");
        const fromJson = buildLibrary(loadJson(path.join(OUT, "library.json")));
        const same = sameBooks(library, fromJson) && sameMembers(library, fromJson);
        console.log(`Reloaded out/library.json: ${fromJson.bookCount} books and ${fromJson.memberCount} members, `
            + `${same ? "same as before" : "DIFFERENT"}`);
        tryLoad("library_corrupt.json", loadJson, path.join(data, "library_corrupt.json"));
        library.borrow(101, 4);
        library.borrow(101, 7);
        saveJson(library, path.join(OUT, "library.json"));
        const restarted = buildLibrary(loadJson(path.join(OUT, "library.json")));
        console.log(`after restart: ${restarted.findMember(101)}`);
        console.log(`after restart: ${restarted.findById(4)}`);
    }
}

main();
