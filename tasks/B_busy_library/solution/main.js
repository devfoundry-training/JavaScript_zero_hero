// @ts-check
// ============================================================
// Task B: Busy library (solution, Core + Stretch)
// ============================================================
// Bonus session: concurrency. Many members borrow at once.
//
// Node runs our JavaScript on one thread, so two members never
// run a line at the same instant. The race comes from await:
// borrowing is "check, then act", and if there is an await
// between the two, other members run while this one is paused:
//     if (shelf.available > 0) {   // 1. check
//         await pause();           //    (others run here)
//         shelf.available -= 1;    // 2. act
//     }
// Every member can pass step 1 before any of them reaches step 2,
// and the library lends copies it does not have.
//
// The fix: a lock (a promise chain) around the whole
// check-and-act, so only one member at a time can be inside it,
// even across the await.
//
// Run:  node tasks/B_busy_library/solution/main.js             (Core: the safe version, checked)
//       node tasks/B_busy_library/solution/main.js --stretch   (Core, then the race without the lock)
// ============================================================

const MEMBERS_1 = 8;
const COPIES_1 = 3;
const MEMBERS_2 = 4;
const COPIES_2 = 4;
const CYCLES = 5000;

/**
 * Let everything else that is waiting run, then carry on: the
 * "busy machine" moment between the check and the act.
 * setImmediate rather than setTimeout(..., 0), which waits at least
 * 1 ms: 20000 of those would take minutes.
 * @returns {Promise<void>}
 */
function pause() {
    return new Promise((resolve) => setImmediate(resolve));
}

/**
 * A lock for async code. Each job waits for the one before it to
 * finish, so jobs run one at a time, in the order they asked.
 */
class Lock {
    /** @type {Promise<unknown>} */
    #tail = Promise.resolve();

    /**
     * @template T
     * @param {() => Promise<T>} job
     * @returns {Promise<T>}
     */
    run(job) {
        const result = this.#tail.then(job);
        this.#tail = result.catch(() => {}); // a failed job must not block the next one
        return result;
    }
}

/**
 * A start line: every member waits at it until all are ready, then
 * they all go at once (a barrier, made from one promise).
 */
class StartLine {
    /** @type {() => void} */
    #release = () => {};
    #ready = new Promise((resolve) => { this.#release = () => resolve(undefined); });

    wait() {
        return this.#ready;
    }

    go() {
        this.#release();
    }
}

/** The copies of one book, shared by every member. */
class Shelf {
    #lock = new Lock();

    /** @param {number} copies */
    constructor(copies) {
        this.copies = copies;
        this.available = copies;
        this.loansRecorded = 0;
    }

    // --- the fix: check and act together, under one lock ----------

    /** @returns {Promise<boolean>} */
    borrowSafe() {
        return this.#lock.run(async () => {
            if (this.available > 0) {
                await pause(); // the same pause as the unsafe version: the lock makes it harmless
                this.available -= 1;
                this.loansRecorded += 1;
                return true;
            }
            return false;
        });
    }

    /** @returns {Promise<void>} */
    giveBackSafe() {
        return this.#lock.run(async () => {
            this.available += 1;
        });
    }

    // --- the race (Stretch only): the same code with no lock --------

    /** @returns {Promise<boolean>} */
    async borrowUnsafe() {
        if (this.available > 0) {
            await pause();
            this.available -= 1;
            const count = this.loansRecorded; // read...
            await pause();
            this.loansRecorded = count + 1; // ...write: an update can be lost in between
            return true;
        }
        return false;
    }

    /** @returns {Promise<void>} */
    async giveBackUnsafe() {
        const value = this.available;
        await pause();
        this.available = value + 1;
    }
}

/**
 * MEMBERS_1 members each try once to borrow from COPIES_1 copies,
 * all starting at the same moment.
 * @param {(shelf: Shelf) => Promise<boolean>} borrow
 * @returns {Promise<{ borrowed: number, refused: number, available: number }>}
 */
async function scenario1(borrow) {
    const shelf = new Shelf(COPIES_1);
    const start = new StartLine();
    const members = [];
    for (let i = 0; i < MEMBERS_1; i++) {
        members.push((async () => {
            await start.wait();
            return borrow(shelf);
        })());
    }
    start.go();
    const results = await Promise.all(members); // wait for every member before counting
    const borrowed = results.filter((ok) => ok).length;
    return { borrowed, refused: results.length - borrowed, available: shelf.available };
}

/**
 * MEMBERS_2 members each borrow and give back CYCLES times. The
 * members run as concurrent tasks and Promise.all waits for all
 * of them (Stretch 2: JavaScript's task API instead of threads).
 * @param {(shelf: Shelf) => Promise<boolean>} borrow
 * @param {(shelf: Shelf) => Promise<void>} giveBack
 * @returns {Promise<{ loans: number, available: number }>}
 */
async function scenario2(borrow, giveBack) {
    const shelf = new Shelf(COPIES_2);

    async function member() {
        for (let i = 0; i < CYCLES; i++) {
            if (await borrow(shelf)) {
                await giveBack(shelf);
            }
        }
    }

    const members = [];
    for (let i = 0; i < MEMBERS_2; i++) {
        members.push(member());
    }
    await Promise.all(members);
    return { loans: shelf.loansRecorded, available: shelf.available };
}

async function main() {
    console.log("Busy library");
    console.log(`Scenario 1: ${MEMBERS_1} members, 1 book with ${COPIES_1} copies, everyone borrows at once`);
    const one = await scenario1((shelf) => shelf.borrowSafe());
    console.log(`borrowed: ${one.borrowed}`);
    console.log(`refused: ${one.refused}`);
    console.log(`available at end: ${one.available}`);

    console.log(`Scenario 2: ${MEMBERS_2} members, ${COPIES_2} copies, ${CYCLES} borrow-and-return cycles each`);
    const two = await scenario2((shelf) => shelf.borrowSafe(), (shelf) => shelf.giveBackSafe());
    console.log(`loans recorded: ${two.loans}`);
    console.log(`available at end: ${two.available}`);

    const ok = one.borrowed === COPIES_1 && one.available === 0
        && two.loans === MEMBERS_2 * CYCLES && two.available === COPIES_2;
    console.log(`Result: ${ok ? "OK" : "WRONG"}`);

    if (process.argv.includes("--stretch")) {
        // Not checked: the numbers can change from run to run, which is the point
        console.log("Stretch: the same scenarios with no lock");
        const race1 = await scenario1((shelf) => shelf.borrowUnsafe());
        console.log(`scenario 1: borrowed ${race1.borrowed} of ${COPIES_1} copies, available at end ${race1.available}`);
        const race2 = await scenario2((shelf) => shelf.borrowUnsafe(), (shelf) => shelf.giveBackUnsafe());
        console.log(`scenario 2: loans recorded ${race2.loans} of ${MEMBERS_2 * CYCLES}, `
            + `available at end ${race2.available}`);
    }
}

await main();
