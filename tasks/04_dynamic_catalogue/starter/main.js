// @ts-check
// ============================================================
// Task 04: Dynamic catalogue (starter)
// ============================================================
// From now on the whole catalogue of twenty books is used. The
// CSV lines and the borrowing script are below. Read the brief in
// tasks/04_dynamic_catalogue/README.md, then replace each todo(...)
// call with your code. (The task 03 solution is in
// tasks/03_functions/solution if you want its helpers.)
//
// Run:    node tasks/04_dynamic_catalogue/starter/main.js
// Check:  py -3.13 tasks/check/check.py 04 -- node tasks/04_dynamic_catalogue/starter/main.js
// ============================================================

/**
 * Placeholder for a step you have not written yet.
 * @param {string} what
 */
function todo(what) {
    console.log(`not implemented: ${what}`);
}

// ------------------------------------------------------------
// The data: the lines of data/books.csv, copied in
// ------------------------------------------------------------
// Reading files comes in task 08.

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
 * One row of books.csv as a plain object.
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
 * Split one CSV line on commas into a Book. Number(text) parses.
 * @param {string} line
 * @returns {Book}
 */
function parseBook(line) {
    throw new Error(`not implemented: parseBook("${line}")`);
}

// ------------------------------------------------------------
// Core 1-5
// ------------------------------------------------------------
// Sort A-Z by comparing a.toLowerCase() with b.toLowerCase()
// using < and > (never localeCompare).

todo(`Core 1, load ${BOOK_LINES.length - 1} books into an array with parseBook`);
todo("Core 2, a Map from genre to titles");
todo("Core 3, a Set of authors");
todo(`Core 4, the borrowing script (${ACTIONS.length} actions)`);
todo("Core 5, the counts");
