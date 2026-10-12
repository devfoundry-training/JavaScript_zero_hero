// @ts-check
// ============================================================
// Task 12: Expose the library (starter)
// ============================================================
// library.js, storage.js and dates.js are the task 11 solution
// (with reservations). api.js starts a server that answers
// "not implemented"; build the endpoints there. Read the brief in
// tasks/12_library_api/README.md.
//
// Run:    node tasks/12_library_api/starter/main.js tasks/data [PORT]
// Check:  py -3.13 tasks/check/check.py 12 -- node tasks/12_library_api/starter/main.js tasks/data {port}
// Stop the server with Ctrl+C.
// ============================================================

import { createServer } from "./api.js";
import { parseDate } from "./dates.js";
import { loadAll } from "./storage.js";

const DEFAULT_PORT = 8080;
const TODAY = parseDate("2026-10-12");

function main() {
    const args = process.argv.slice(2);
    if (args[0] === "--summarise") {
        console.log(`not implemented: summarise ${args[1]} (Stretch 1)`);
        return;
    }
    const data = args[0] ?? "tasks/data";
    const port = args[1] === undefined ? DEFAULT_PORT : Number(args[1]);

    const server = createServer(loadAll(data), TODAY);
    server.listen(port, "localhost", () => {
        console.log(`Library API on http://localhost:${port}: not implemented, every request gets a 501`);
    });
}

main();
