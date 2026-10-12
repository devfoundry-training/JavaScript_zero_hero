// @ts-check
// ============================================================
// Task 12: Expose the library (solution, Core + Stretch)
// ============================================================
// Session 12: APIs. Builds on task 11.
//
// Run the server:   node tasks/12_library_api/solution/main.js DATA_DIR [PORT] [TODAY]
//                   (PORT defaults to 8080, TODAY to 2026-10-12)
// Then try:         curl http://localhost:8080/books?title=the
// Stop it with Ctrl+C.
//
// Stretch, offline: node tasks/12_library_api/solution/main.js --summarise FILE
//   prints the summary of a saved Open Library response
// Stretch, online:  node tasks/12_library_api/solution/main.js --lookup TITLE
// ============================================================

import * as fs from "node:fs";

import { createServer } from "./api.js";
import { formatDate, parseDate } from "./dates.js";
import * as openlibrary from "./openlibrary.js";
import { loadAll } from "./storage.js";

const DEFAULT_PORT = 8080;
const DEFAULT_TODAY = "2026-10-12";

async function main() {
    const args = process.argv.slice(2);
    if (args.length === 2 && args[0] === "--summarise") {
        console.log(openlibrary.summarise(fs.readFileSync(args[1], "utf8")).join("\n"));
        return;
    }
    if (args.length === 2 && args[0] === "--lookup") {
        try {
            console.log(openlibrary.summarise(await openlibrary.search(args[1])).join("\n"));
        } catch (error) {
            console.log(`Open Library did not answer: ${error instanceof Error ? error.message : error}`);
        }
        return;
    }

    const data = args[0] ?? "tasks/data";
    const port = args[1] === undefined ? DEFAULT_PORT : Number(args[1]);
    const today = parseDate(args[2] ?? DEFAULT_TODAY, "today");

    // Every start loads a fresh library from the CSV files, so every
    // run of the check sees the same data
    const server = createServer(loadAll(data), today);
    server.listen(port, "localhost", () => {
        console.log(`Library API on http://localhost:${port} (today is ${formatDate(today)})`);
    });
}

await main();
