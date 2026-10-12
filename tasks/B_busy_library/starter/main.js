// @ts-check
// ============================================================
// Task B: Busy library (starter)
// ============================================================
// Standalone: no files, one Shelf. Node runs your code on one
// thread, so the race comes from await: make borrow() check, then
// await pause(), then act, and start all the members together with
// Promise.all. Then fix it with a lock. Read the brief in
// tasks/B_busy_library/README.md.
//
// Run:    node tasks/B_busy_library/starter/main.js
// Check:  py -3.13 tasks/check/check.py B -- node tasks/B_busy_library/starter/main.js
// ============================================================

const MEMBERS_1 = 8;
const COPIES_1 = 3;
const MEMBERS_2 = 4;
const COPIES_2 = 4;
const CYCLES = 5000;

/**
 * Let everything else that is waiting run, then carry on.
 * (setImmediate, not setTimeout: setTimeout waits at least 1 ms.)
 * @returns {Promise<void>}
 */
function pause() {
    return new Promise((resolve) => setImmediate(resolve));
}

/** The copies of one book, shared by every member. */
class Shelf {
    /** @param {number} copies */
    constructor(copies) {
        this.copies = copies;
        this.available = copies;
        this.loansRecorded = 0;
    }

    /**
     * Core 1: true and a loan recorded when a copy is available,
     * false otherwise. The whole check-and-act goes inside a lock.
     * @returns {Promise<boolean>}
     */
    async borrow() {
        await pause();
        throw new Error("not implemented: Shelf.borrow");
    }

    /** @returns {Promise<void>} */
    async giveBack() {
        throw new Error("not implemented: Shelf.giveBack");
    }
}

async function main() {
    console.log("Busy library");
    console.log(`Scenario 1: ${MEMBERS_1} members, 1 book with ${COPIES_1} copies, everyone borrows at once`);
    console.log(`not implemented: scenario 1 (a shelf of ${new Shelf(COPIES_1).copies} copies is ready)`);
    console.log(`Scenario 2: ${MEMBERS_2} members, ${COPIES_2} copies, ${CYCLES} borrow-and-return cycles each`);
    console.log("not implemented: scenario 2 and the Result line");
}

await main();
