// @ts-check
// ============================================================
// Task 04: Dynamic catalogue (solution, Core + Stretch)
// ============================================================
// Session 4: collections. Builds on task 03: the fixed shelf of
// 10 becomes an array of all 20 books, plus a Map and a Set.
//
// Run:  node tasks/04_dynamic_catalogue/solution/main.js             (Core, checked)
//       node tasks/04_dynamic_catalogue/solution/main.js --stretch   (Core, then the Stretch)
// ============================================================

// ------------------------------------------------------------
// The data: the lines of data/books.csv, copied in
// ------------------------------------------------------------
// Reading files comes in task 08. Until then the program carries
// its own copy of the CSV lines, header first.

const BOOK_LINES = [
    "id,title,author,year,genre,copies,format,length",
    "1,Pride and Prejudice,Jane Austen,1813,Classic,3,print,432",
    "2,Nineteen Eighty-Four,George Orwell,1949,Dystopian,2,print,328",
    "3,The Hobbit,J. R. R. Tolkien,1937,Fantasy,0,print,310",
    "4,Dune,Frank Herbert,1965,Science Fiction,4,print,412",
    "5,Robinson Crusoe,Daniel Defoe,1719,Adventure,1,print,320",
    "6,The Time Machine,H. G. Wells,1895,Science Fiction,2,ebook,118",
    "7,Animal Farm,George Orwell,1945,Dystopian,5,print,112",
    "8,Emma,Jane Austen,1815,Classic,1,audio,1150",
    "9,The Left Hand of Darkness,Ursula K. Le Guin,1969,Science Fiction,0,print,304",
    "10,Murder on the Orient Express,Agatha Christie,1934,Crime,2,print,256",
    "11,The Murder of Roger Ackroyd,Agatha Christie,1926,Crime,1,ebook,312",
    "12,A Wizard of Earthsea,Ursula K. Le Guin,1968,Fantasy,2,print,183",
    "13,Brave New World,Aldous Huxley,1932,Dystopian,2,audio,480",
    "14,The Martian,Andy Weir,2011,Science Fiction,3,print,369",
    "15,Small Island,Andrea Levy,2004,Historical,1,print,441",
    "16,Wolf Hall,Hilary Mantel,2009,Historical,2,audio,1440",
    "17,The Remains of the Day,Kazuo Ishiguro,1989,Literary,2,print,258",
    "18,Never Let Me Go,Kazuo Ishiguro,2005,Literary,1,ebook,288",
    "19,Frankenstein,Mary Shelley,1818,Gothic,2,print,280",
    "20,The War of the Worlds,H. G. Wells,1898,Science Fiction,3,audio,410",
];

/** The borrowing script: [action, book id], applied in order */
const ACTIONS = /** @type {const} */ ([
    ["borrow", 1],
    ["borrow", 1],
    ["borrow", 4],
    ["return", 1],
    ["borrow", 3],
    ["borrow", 7],
    ["return", 9],
    ["borrow", 1],
]);

/**
 * One row of books.csv. A plain object is the record: data with
 * no behaviour (classes come in task 05).
 * @typedef {object} Book
 * @property {number} id
 * @property {string} title
 * @property {string} author
 * @property {number} year
 * @property {string} genre
 * @property {number} copies
 * @property {string} format
 * @property {number} length
 */

/**
 * @param {string} line
 * @returns {Book}
 */
function parseBook(line) {
    const f = line.split(",");
    return {
        id: Number(f[0]),
        title: f[1],
        author: f[2],
        year: Number(f[3]),
        genre: f[4],
        copies: Number(f[5]),
        format: f[6],
        length: Number(f[7]),
    };
}

/**
 * Compare for A-Z ignoring case, character by character. Never
 * localeCompare: depending on the locale it can ignore spaces and
 * punctuation, so the order would change from machine to machine.
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function byName(a, b) {
    const x = a.toLowerCase();
    const y = b.toLowerCase();
    if (x < y) {
        return -1;
    }
    return x > y ? 1 : 0;
}

/**
 * Add one to a counter kept in a Map, starting from 0.
 * @template K
 * @param {Map<K, number>} counts
 * @param {K} key
 */
function addOne(counts, key) {
    counts.set(key, (counts.get(key) ?? 0) + 1);
}

// ------------------------------------------------------------
// Core 1: load every line into an array
// ------------------------------------------------------------

/** @type {Book[]} */
const books = [];
for (const line of BOOK_LINES.slice(1)) { // slice(1) skips the header row
    books.push(parseBook(line));
}
console.log(`Loaded ${books.length} books`);

// ------------------------------------------------------------
// Core 2: index by genre (Map of genre -> array of titles)
// ------------------------------------------------------------

/** @type {Map<string, string[]>} */
const byGenre = new Map();
for (const book of books) {
    if (!byGenre.has(book.genre)) {
        byGenre.set(book.genre, []);
    }
    byGenre.get(book.genre)?.push(book.title);
}

const genres = [...byGenre.keys()].sort(byName);
console.log(`Genres (${byGenre.size})`);
for (const genre of genres) {
    const titles = byGenre.get(genre) ?? [];
    console.log(`${genre} (${titles.length}): ${titles.join(", ")}`);
}

// ------------------------------------------------------------
// Core 3: unique authors (a Set drops the duplicates for us)
// ------------------------------------------------------------

const authors = new Set(books.map((book) => book.author));
console.log(`Authors (${authors.size} unique across ${books.length} books)`);
for (const author of [...authors].sort(byName)) {
    console.log(author);
}

// ------------------------------------------------------------
// Core 4 and 5: borrow and return, counted in Maps keyed by book id
// ------------------------------------------------------------

/** @type {Map<number, Book>} */
const catalogue = new Map(books.map((book) => [book.id, book]));
/** @type {Map<number, number>} */
const onLoan = new Map();
/** @type {Map<number, number>} */
const borrowedCount = new Map();
/** @type {Map<number, number>} */
const returnedCount = new Map();
let borrows = 0;
let returns = 0;
let refused = 0;

console.log("Borrowing");
for (const [action, bookId] of ACTIONS) {
    const book = catalogue.get(bookId);
    if (book === undefined) {
        continue; // every id in the script exists, but Map.get can miss
    }
    const out = onLoan.get(bookId) ?? 0;
    if (action === "borrow") {
        if (out < book.copies) {
            onLoan.set(bookId, out + 1);
            addOne(borrowedCount, bookId);
            borrows++;
            console.log(`borrow ${bookId}: OK, ${book.copies - out - 1} left`);
        } else {
            refused++;
            console.log(`borrow ${bookId}: refused, none available`);
        }
    } else if (out > 0) {
        onLoan.set(bookId, out - 1);
        addOne(returnedCount, bookId);
        returns++;
        console.log(`return ${bookId}: OK, ${book.copies - out + 1} left`);
    } else {
        refused++;
        console.log(`return ${bookId}: refused, none on loan`);
    }
}

console.log("Counts");
console.log(`borrows: ${borrows}`);
console.log(`returns: ${returns}`);
console.log(`refused: ${refused}`);
// Map keys keep insertion order, so sort the ids (numbers, a - b)
for (const bookId of [...borrowedCount.keys()].sort((a, b) => a - b)) {
    console.log(`book ${bookId}: borrowed ${borrowedCount.get(bookId)}, returned ${returnedCount.get(bookId) ?? 0}`);
}

// ------------------------------------------------------------
// Stretch: busy authors, books per decade, the biggest genre
// ------------------------------------------------------------

if (process.argv.includes("--stretch")) {
    console.log("Stretch");

    /** @type {Map<string, number>} */
    const perAuthor = new Map();
    for (const book of books) {
        addOne(perAuthor, book.author);
    }
    const busy = [...perAuthor.keys()].sort(byName).filter((author) => (perAuthor.get(author) ?? 0) > 1);
    console.log(`Authors with more than one book: ${busy.join(", ")}`);

    /** @type {Map<number, number>} */
    const perDecade = new Map();
    for (const book of books) {
        addOne(perDecade, Math.floor(book.year / 10) * 10); // 1813 -> 1810
    }
    for (const decade of [...perDecade.keys()].sort((a, b) => a - b)) {
        console.log(`${decade}s: ${perDecade.get(decade)}`);
    }

    // Most books wins; a tie goes to the genre first in A-Z order
    let biggest = genres[0];
    for (const genre of genres) {
        if ((byGenre.get(genre)?.length ?? 0) > (byGenre.get(biggest)?.length ?? 0)) {
            biggest = genre;
        }
    }
    console.log(`Biggest genre: ${biggest} (${byGenre.get(biggest)?.length} books)`);
}
