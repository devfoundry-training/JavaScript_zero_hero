// @ts-check
// ============================================================
// Task 07: Errors done properly (starter)
// ============================================================
// library.js holds the task 06 model. Add the exceptions there,
// then write the command loop here. Read the brief in
// tasks/07_errors/README.md.
//
// Run:    node tasks/07_errors/starter/main.js < tasks/data/input_07.txt
// Check:  py -3.13 tasks/check/check.py 07 -- node tasks/07_errors/starter/main.js
// ============================================================

import * as readline from "node:readline";

import { Library, Member, makeBook } from "./library.js";

// The lines of data/books.csv and data/members.csv (files come in task 08)
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

const MEMBER_LINES = [
    "id,name,email,type,joined",
    "101,Amira Khan,amira.khan@example.com,standard,2023-01-15",
    "102,Ben Taylor,ben.taylor@example.com,student,2024-09-02",
    "103,Chloe Evans,chloe.evans@example.com,staff,2019-05-20",
    "104,Dev Patel,dev.patel@example.com,student,2025-09-10",
    "105,Ella Brown,ella.brown@example.com,standard,2021-03-08",
    "106,Femi Adeyemi,femi.adeyemi@example.com,standard,2022-11-30",
    "107,Grace Wilson,grace.wilson@example.com,staff,2018-07-01",
    "108,Harry Jones,harry.jones@example.com,student,2026-01-12",
    "109,Ben Taylor,ben.taylor2@example.com,standard,2025-02-14",
];

function loadLibrary() {
    const library = new Library();
    for (const line of BOOK_LINES.slice(1)) {
        library.addBook(makeBook(line.split(",")));
    }
    for (const line of MEMBER_LINES.slice(1)) {
        const f = line.split(",");
        library.addMember(new Member(Number(f[0]), f[1], f[2], f[3], f[4]));
    }
    return library;
}

/**
 * Do one command (borrow, return or loans) and return the line to
 * print, or throw a LibraryError subclass.
 * @param {Library} library
 * @param {string[]} words
 * @returns {string}
 */
function runCommand(library, words) {
    throw new Error(`not implemented: runCommand(${words.join(" ")}) on ${library.allBooks().length} books`);
}

async function main() {
    const library = loadLibrary();
    console.log(`Library Manager: ${library.allBooks().length} books, ${MEMBER_LINES.length - 1} members`);
    const input = readline.createInterface({ input: process.stdin });
    for await (const line of input) {
        // Core 3-6: skip blank lines, echo "> WORDS", stop at quit,
        // call runCommand inside try / catch and print "Error: ..."
        console.log(`not implemented: the command loop (first line was "${line}")`);
        break;
    }
    input.close();
    console.log("Goodbye");
}

await main();
