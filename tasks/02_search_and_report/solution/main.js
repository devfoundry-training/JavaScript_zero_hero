// @ts-check
// ============================================================
// Task 02: Search and report (solution, Core + Stretch)
// ============================================================
// Session 2: loops and strings. Builds on task 01 (same shelf).
//
// Run:  node tasks/02_search_and_report/solution/main.js             (Core, checked)
//       node tasks/02_search_and_report/solution/main.js --stretch   (Core, then the Stretch)
// ============================================================

// ------------------------------------------------------------
// The shelf from task 01 (parallel arrays, never resized)
// ------------------------------------------------------------

const SIZE = 10;

/** @type {number[]} */
const ids = Object.seal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
/** @type {string[]} */
const titles = Object.seal([
    "Pride and Prejudice",
    "Nineteen Eighty-Four",
    "The Hobbit",
    "Dune",
    "Robinson Crusoe",
    "The Time Machine",
    "Animal Farm",
    "Emma",
    "The Left Hand of Darkness",
    "Murder on the Orient Express",
]);
/** @type {number[]} */
const years = Object.seal([1813, 1949, 1937, 1965, 1719, 1895, 1945, 1815, 1969, 1934]);
/** @type {number[]} */
const copies = Object.seal([3, 2, 0, 4, 1, 2, 5, 1, 0, 2]);

const SEARCH_TERMS = ["the", "TIME", "zzz"];

// ------------------------------------------------------------
// Core 1: a formatted report table
// ------------------------------------------------------------
// Column widths: id 2 (right), title 30 (left), year 4,
// copies 6 (right), two spaces between columns.
// padStart pads on the left (right-aligns), padEnd on the right.

console.log("Report");
console.log(`${"ID".padStart(2)}  ${"Title".padEnd(30)}  ${"Year".padEnd(4)}  ${"Copies".padStart(6)}`);
console.log(`${"-".repeat(2)}  ${"-".repeat(30)}  ${"-".repeat(4)}  ${"-".repeat(6)}`);
for (let i = 0; i < SIZE; i++) {
    console.log(`${String(ids[i]).padStart(2)}  ${titles[i].padEnd(30)}  ${String(years[i]).padEnd(4)}  `
        + `${String(copies[i]).padStart(6)}`);
}

// ------------------------------------------------------------
// Core 2: case-insensitive search
// ------------------------------------------------------------
// Lower-case both sides, then look for the term anywhere in the
// title. A while loop collects matches into a fixed array.

for (const term of SEARCH_TERMS) {
    /** @type {string[]} */
    const found = Object.seal(new Array(SIZE).fill(""));
    let count = 0;
    let i = 0;
    while (i < SIZE) {
        if (titles[i].toLowerCase().includes(term.toLowerCase())) {
            found[count] = titles[i];
            count++;
        }
        i++;
    }

    if (count === 0) {
        console.log(`Search "${term}": no matches`);
    } else {
        const noun = count === 1 ? "match" : "matches";
        console.log(`Search "${term}": ${count} ${noun}`);
        for (let j = 0; j < count; j++) {
            console.log(`  ${found[j]}`);
        }
    }
}

// ------------------------------------------------------------
// Core 3: count the words in all titles
// ------------------------------------------------------------
// split(/\s+/) splits on any run of spaces, so "Eighty-Four"
// stays one word. trim() first, or a leading space gives an
// empty first "word".

let words = 0;
for (const title of titles) {
    words += title.trim().split(/\s+/).length;
}
console.log(`Words in titles: ${words}`);

// ------------------------------------------------------------
// Core 4: the longest title (the first one wins a tie)
// ------------------------------------------------------------

let longest = 0;
for (let i = 1; i < SIZE; i++) {
    if (titles[i].length > titles[longest].length) { // > not >=, so ties keep the first
        longest = i;
    }
}
console.log(`Longest title: ${titles[longest]} (${titles[longest].length} characters)`);

// ------------------------------------------------------------
// Stretch: initials, shortest title, a compact report
// ------------------------------------------------------------

if (process.argv.includes("--stretch")) {
    console.log("Stretch");
    for (const title of titles) {
        let initials = "";
        for (const word of title.trim().split(/\s+/)) {
            initials += word[0].toUpperCase();
        }
        console.log(`${initials.padEnd(6)}${title}`);
    }

    let shortest = 0;
    for (let i = 1; i < SIZE; i++) {
        if (titles[i].length < titles[shortest].length) {
            shortest = i;
        }
    }
    console.log(`Shortest title: ${titles[shortest]} (${titles[shortest].length} characters)`);

    // Titles longer than 20 characters are cut to 17 plus "..."
    for (let i = 0; i < SIZE; i++) {
        const short = titles[i].length <= 20 ? titles[i] : titles[i].slice(0, 17) + "...";
        console.log(`${String(ids[i]).padStart(2)}  ${short.padEnd(20)}  ${years[i]}`);
    }
}
