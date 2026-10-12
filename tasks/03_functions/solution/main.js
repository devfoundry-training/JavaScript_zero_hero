// @ts-check
// ============================================================
// Task 03: Functions and a menu (solution, Core + Stretch)
// ============================================================
// Session 3: functions. Builds on task 02.
//
// Run:  node tasks/03_functions/solution/main.js < tasks/data/input_03.txt
//       node tasks/03_functions/solution/main.js --stretch < tasks/data/input_03.txt
// Type the choices yourself if you run it without "<".
// ============================================================

import * as readline from "node:readline";

import { catalogue, report, searchReport, stats } from "./shelf.js"; // Stretch 1: our own module

const MENU = "Menu: 1 catalogue | 2 search | 3 report | 4 stats | 0 quit";

// readline gives us one line at a time, from the keyboard or from
// a file piped in with "<". We ask the iterator for the next line
// ourselves, so the menu can read a second line (the search term).
const input = readline.createInterface({ input: process.stdin });
const lines = input[Symbol.asyncIterator]();

/**
 * Read one line and echo it as "> text", so the output reads like
 * a transcript even when the input comes from a file.
 * @returns {Promise<string | undefined>} the trimmed line, or undefined at the end of the input
 */
async function readLine() {
    const next = await lines.next();
    if (next.done) {
        return undefined;
    }
    const text = next.value.trim();
    console.log(text ? `> ${text}` : ">"); // never leave a trailing space
    return text;
}

/** @param {string[]} output */
function show(output) {
    for (const line of output) {
        console.log(line);
    }
}

/** @param {boolean} includeStretch */
async function runMenu(includeStretch) {
    console.log("Library Manager");
    while (true) {
        console.log(MENU);
        const choice = await readLine();
        if (choice === undefined || choice === "0") {
            break;
        }

        // The choice is compared as text, so "abc" is just another
        // unknown choice: no number parsing, nothing to go wrong.
        if (choice === "1") {
            show(catalogue());
        } else if (choice === "2") {
            console.log("Search for:");
            const term = await readLine();
            if (term === undefined) {
                break;
            }
            show(searchReport(term));
        } else if (choice === "3") {
            show(report());
        } else if (choice === "4") {
            show(stats(includeStretch));
        } else {
            console.log(`Unknown choice: ${choice}`);
        }
    }
    console.log("Goodbye");
    input.close();
}

await runMenu(process.argv.includes("--stretch"));
