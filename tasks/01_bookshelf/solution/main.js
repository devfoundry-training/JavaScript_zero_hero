// @ts-check
// ============================================================
// Task 01: Bookshelf (solution, Core + Stretch)
// ============================================================
// Session 1: data types, operators, conditionals, switch, arrays.
//
// Run:  node tasks/01_bookshelf/solution/main.js             (Core, checked)
//       node tasks/01_bookshelf/solution/main.js --stretch   (Core, then the Stretch)
// ============================================================

// ------------------------------------------------------------
// The shelf: four parallel "arrays", one per field
// ------------------------------------------------------------
// JavaScript arrays always grow, so we create each one with all
// ten values and agree never to push or splice. Object.seal
// makes that a rule: adding or removing an element now throws.
// Position i in every array describes the same book.

const SIZE = 10;
const OLD_BEFORE = 1950;

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

/**
 * Name the century a year belongs to, using switch on year / 100.
 * @param {number} year
 * @returns {string}
 */
function eraOf(year) {
    // Every number is floating point: 1813 / 100 is 18.13, so
    // Math.floor turns it into the whole number 18
    switch (Math.floor(year / 100)) {
        case 17:
            return "18th century";
        case 18:
            return "19th century";
        case 19:
            return "20th century";
        case 20:
            return "21st century";
        default:
            return "unknown era";
    }
}

/**
 * "out of stock", "1 copy" or "N copies".
 * @param {number} count
 * @returns {string}
 */
function copiesText(count) {
    if (count === 0) {
        return "out of stock";
    } else if (count === 1) {
        return "1 copy";
    } else {
        return `${count} copies`;
    }
}

// ------------------------------------------------------------
// Core 2-5: the catalogue with copies, century and the pre-1950 flag
// ------------------------------------------------------------

console.log(`Catalogue (${SIZE} books)`);
for (let i = 0; i < SIZE; i++) {
    let line = `${ids[i]} | ${titles[i]} | ${years[i]} | ${copiesText(copies[i])} | ${eraOf(years[i])}`;
    if (years[i] < OLD_BEFORE) {
        line += " | pre-1950";
    }
    console.log(line);
}

// ------------------------------------------------------------
// Core 6: "remove" the even ids
// ------------------------------------------------------------
// A fixed array cannot shrink, so we copy the books we keep into
// a second pair of arrays of the same size and count the slots used.

/** @type {number[]} */
const keptIds = Object.seal(new Array(SIZE).fill(0));
/** @type {string[]} */
const keptTitles = Object.seal(new Array(SIZE).fill(""));
let kept = 0;
for (let i = 0; i < SIZE; i++) {
    if (ids[i] % 2 !== 0) { // % is the remainder: odd ids leave 1
        keptIds[kept] = ids[i];
        keptTitles[kept] = titles[i];
        kept++;
    }
}

console.log(`Odd ids only (${kept} books)`);
for (let i = 0; i < kept; i++) {
    console.log(`${keptIds[i]} | ${keptTitles[i]}`);
}

// ------------------------------------------------------------
// Core 7: totals with arithmetic and comparison operators
// ------------------------------------------------------------

let totalCopies = 0;
let outOfStock = 0;
let oldBooks = 0;
let yearSum = 0;
for (let i = 0; i < SIZE; i++) {
    totalCopies += copies[i];
    yearSum += years[i];
    if (copies[i] === 0) {
        outOfStock++;
    }
    if (years[i] < OLD_BEFORE) {
        oldBooks++;
    }
}

console.log("Totals");
console.log(`books: ${SIZE}`);
console.log(`copies: ${totalCopies}`);
console.log(`out of stock: ${outOfStock}`);
console.log(`pre-1950: ${oldBooks}`);
console.log(`average year: ${Math.floor(yearSum / SIZE)}`); // integer division, rounds down

// ------------------------------------------------------------
// Stretch: oldest and newest, and a count per century
// ------------------------------------------------------------

if (process.argv.includes("--stretch")) {
    let oldest = 0;
    let newest = 0;
    for (let i = 1; i < SIZE; i++) {
        if (years[i] < years[oldest]) {
            oldest = i;
        }
        if (years[i] > years[newest]) {
            newest = i;
        }
    }
    console.log("Stretch");
    console.log(`oldest: ${titles[oldest]} (${years[oldest]})`);
    console.log(`newest: ${titles[newest]} (${years[newest]})`);

    // One counter per century, in a fixed order
    const eraNames = Object.seal(["18th century", "19th century", "20th century", "21st century"]);
    const eraCounts = Object.seal([0, 0, 0, 0]);
    for (let i = 0; i < SIZE; i++) {
        for (let e = 0; e < eraNames.length; e++) {
            if (eraOf(years[i]) === eraNames[e]) {
                eraCounts[e]++;
            }
        }
    }
    for (let e = 0; e < eraNames.length; e++) {
        console.log(`${eraNames[e]}: ${eraCounts[e]}`);
    }
}
