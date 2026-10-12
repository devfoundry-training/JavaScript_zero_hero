// @ts-check
// ============================================================
// Task 03: shelf module, every task 01/02 feature as a function
// ============================================================
// Stretch 1: the functions live in their own ES module and
// main.js imports them. Nothing here prints; every function
// returns a value (a string, a number or an array of lines) and
// main.js decides what to print.
// ============================================================

export const SIZE = 10;
const OLD_BEFORE = 1950;

/** @type {readonly number[]} */
const IDS = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
/** @type {readonly string[]} */
const TITLES = Object.freeze([
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
/** @type {readonly number[]} */
const YEARS = Object.freeze([1813, 1949, 1937, 1965, 1719, 1895, 1945, 1815, 1969, 1934]);
/** @type {readonly number[]} */
const COPIES = Object.freeze([3, 2, 0, 4, 1, 2, 5, 1, 0, 2]);

// ------------------------------------------------------------
// Small helpers (task 01)
// ------------------------------------------------------------

/**
 * The century a year belongs to, from Math.floor(year / 100).
 * @param {number} year
 * @returns {string}
 */
export function eraOf(year) {
    switch (Math.floor(year / 100)) {
        case 17: return "18th century";
        case 18: return "19th century";
        case 19: return "20th century";
        case 20: return "21st century";
        default: return "unknown era";
    }
}

/**
 * "out of stock", "1 copy" or "N copies".
 * @param {number} count
 * @returns {string}
 */
export function copiesText(count) {
    if (count === 0) {
        return "out of stock";
    }
    if (count === 1) {
        return "1 copy";
    }
    return `${count} copies`;
}

/**
 * @param {number} year
 * @returns {boolean}
 */
function isOld(year) {
    return year < OLD_BEFORE;
}

/**
 * "1 match" or "4 matches": the number and the right noun.
 * @param {number} count
 * @param {string} singular
 * @param {string} many
 * @returns {string}
 */
function plural(count, singular, many) {
    return `${count} ${count === 1 ? singular : many}`;
}

// ------------------------------------------------------------
// Features (tasks 01 and 02)
// ------------------------------------------------------------

/**
 * @param {number} i position on the shelf
 * @returns {string}
 */
export function catalogueLine(i) {
    let line = `${IDS[i]} | ${TITLES[i]} | ${YEARS[i]} | ${copiesText(COPIES[i])} | ${eraOf(YEARS[i])}`;
    if (isOld(YEARS[i])) {
        line += " | pre-1950";
    }
    return line;
}

/** @returns {string[]} */
export function catalogue() {
    const lines = [`Catalogue (${SIZE} books)`];
    for (let i = 0; i < SIZE; i++) {
        lines.push(catalogueLine(i));
    }
    return lines;
}

/**
 * Titles containing term, ignoring case, in shelf order.
 * @param {string} term
 * @returns {string[]}
 */
export function search(term) {
    /** @type {string[]} */
    const found = [];
    for (const title of TITLES) {
        if (title.toLowerCase().includes(term.toLowerCase())) {
            found.push(title);
        }
    }
    return found;
}

/**
 * @param {string} term
 * @returns {string[]}
 */
export function searchReport(term) {
    const found = search(term);
    if (found.length === 0) {
        return [`Search "${term}": no matches`];
    }
    const lines = [`Search "${term}": ${plural(found.length, "match", "matches")}`];
    for (const title of found) {
        lines.push(`  ${title}`);
    }
    return lines;
}

/** @returns {string[]} */
export function report() {
    const lines = [
        "Report",
        `${"ID".padStart(2)}  ${"Title".padEnd(30)}  ${"Year".padEnd(4)}  ${"Copies".padStart(6)}`,
        `${"-".repeat(2)}  ${"-".repeat(30)}  ${"-".repeat(4)}  ${"-".repeat(6)}`,
    ];
    for (let i = 0; i < SIZE; i++) {
        lines.push(`${String(IDS[i]).padStart(2)}  ${TITLES[i].padEnd(30)}  ${String(YEARS[i]).padEnd(4)}  `
            + `${String(COPIES[i]).padStart(6)}`);
    }
    return lines;
}

/** @returns {number} */
export function totalCopies() {
    let total = 0;
    for (const count of COPIES) {
        total += count;
    }
    return total;
}

/** @returns {number} */
export function countOutOfStock() {
    let count = 0;
    for (const copies of COPIES) {
        if (copies === 0) {
            count++;
        }
    }
    return count;
}

/** @returns {number} */
export function countOld() {
    let count = 0;
    for (const year of YEARS) {
        if (isOld(year)) {
            count++;
        }
    }
    return count;
}

/** @returns {number} */
export function averageYear() {
    let total = 0;
    for (const year of YEARS) {
        total += year;
    }
    return Math.floor(total / SIZE); // integer division
}

/** @returns {number} */
export function wordCount() {
    let words = 0;
    for (const title of TITLES) {
        words += title.trim().split(/\s+/).length;
    }
    return words;
}

/** @returns {string} */
export function longestTitle() {
    let longest = TITLES[0];
    for (const title of TITLES.slice(1)) {
        if (title.length > longest.length) {
            longest = title;
        }
    }
    return longest;
}

/**
 * Stretch 2: two results from one function, returned as an array
 * of two positions and unpacked with destructuring by the caller.
 * @returns {[number, number]}
 */
export function oldestAndNewest() {
    let oldest = 0;
    let newest = 0;
    for (let i = 1; i < SIZE; i++) {
        if (YEARS[i] < YEARS[oldest]) {
            oldest = i;
        }
        if (YEARS[i] > YEARS[newest]) {
            newest = i;
        }
    }
    return [oldest, newest];
}

/**
 * @param {boolean} [includeStretch] add the oldest and newest lines
 * @returns {string[]}
 */
export function stats(includeStretch = false) {
    const longest = longestTitle();
    const lines = [
        "Stats",
        `books: ${SIZE}`,
        `copies: ${totalCopies()}`,
        `out of stock: ${countOutOfStock()}`,
        `pre-1950: ${countOld()}`,
        `average year: ${averageYear()}`,
        `words in titles: ${wordCount()}`,
        `longest title: ${longest} (${longest.length} characters)`,
    ];
    if (includeStretch) {
        const [oldest, newest] = oldestAndNewest();
        lines.push(`oldest: ${TITLES[oldest]} (${YEARS[oldest]})`);
        lines.push(`newest: ${TITLES[newest]} (${YEARS[newest]})`);
    }
    return lines;
}
