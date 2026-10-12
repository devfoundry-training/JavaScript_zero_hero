// @ts-check
// ============================================================
// Task 07: Errors done properly (solution, Core + Stretch)
// ============================================================
// Session 7: exceptions. Builds on task 06.
// Reads commands, one per line, and never crashes:
//   borrow MEMBER_ID BOOK_ID | return MEMBER_ID BOOK_ID
//   loans MEMBER_ID          | quit
//
// Run:  node tasks/07_errors/solution/main.js < tasks/data/input_07.txt
//       node tasks/07_errors/solution/main.js --stretch < tasks/data/input_07.txt
//       node tasks/07_errors/solution/main.js --stretch --debug < tasks/data/input_07.txt
// ============================================================

import * as readline from "node:readline";

import { CommandError, Library, LibraryError, Member, makeBook, plural } from "./library.js";

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

// ------------------------------------------------------------
// Turning text into commands
// ------------------------------------------------------------

const WHOLE_NUMBER = /^-?[0-9]+$/;

/**
 * "4" -> 4. Anything else becomes a CommandError we wrote.
 * Number() never throws: Number("x") is NaN and Number("") is 0,
 * so we check the text against a pattern first. BigInt() does
 * throw (a SyntaxError) for most bad text, and we keep that error
 * as the cause of ours (Stretch 2: exception chaining).
 * @param {string} text
 * @param {string} what "member id" or "book id"
 * @returns {number}
 */
function parseId(text, what) {
    try {
        if (!WHOLE_NUMBER.test(text)) {
            BigInt(text); // throws for "x" or "4.5"
            throw new SyntaxError(`${text} is not plain digits`); // BigInt allows "+4" and "0x4"
        }
        return Number(text);
    } catch (error) {
        throw new CommandError(`${what} must be a whole number, got '${text}'`, { cause: error });
    }
}

/**
 * Do one command and return the line to print. Throws a
 * LibraryError (or a subclass) when the command cannot be done.
 * @param {Library} library
 * @param {string[]} words
 * @returns {string}
 */
function runCommand(library, words) {
    const command = words[0].toLowerCase();
    const args = words.slice(1);

    switch (command) {
        case "borrow":
        case "return": {
            if (args.length !== 2) {
                throw new CommandError(`usage: ${command} MEMBER_ID BOOK_ID`);
            }
            const memberId = parseId(args[0], "member id");
            const bookId = parseId(args[1], "book id");
            if (command === "borrow") {
                const { member, book } = library.borrow(memberId, bookId);
                return `OK: ${member.name} borrowed ${book.title}, due in ${member.policy.loanDays()} days`;
            }
            const { member, book } = library.returnBook(memberId, bookId);
            return `OK: ${member.name} returned ${book.title}`;
        }
        case "loans": {
            if (args.length !== 1) {
                throw new CommandError("usage: loans MEMBER_ID");
            }
            const member = library.member(parseId(args[0], "member id"));
            if (member.loans.length === 0) {
                return `${member.name} has no loans`;
            }
            const titles = member.loans.map((bookId) => library.book(bookId).title);
            return `${member.name} has ${plural(titles.length, "loan", "loans")}: ${titles.join(", ")}`;
        }
        default:
            throw new CommandError(`unknown command '${words[0]}'`);
    }
}

async function main() {
    const stretch = process.argv.includes("--stretch");
    const debug = process.argv.includes("--debug");
    const library = loadLibrary();
    console.log(`Library Manager: ${library.bookCount} books, ${library.memberCount} members`);

    let commands = 0;
    let ok = 0;
    let errors = 0;
    const input = readline.createInterface({ input: process.stdin });
    try {
        for await (const line of input) {
            const words = line.trim().split(/\s+/).filter((word) => word !== "");
            if (words.length === 0) {
                continue; // blank lines are skipped without a word
            }
            console.log(`> ${words.join(" ")}`);
            if (words[0].toLowerCase() === "quit") {
                break;
            }
            commands++;
            try {
                console.log(runCommand(library, words));
                ok++;
            } catch (error) {
                errors++;
                if (error instanceof LibraryError) {
                    console.log(`Error: ${error.message}`);
                    if (debug && error.cause !== undefined) {
                        console.log(`  cause: ${error.cause}`); // Stretch 2: the chained error
                    }
                } else {
                    // A bug of ours: report it, keep going
                    console.log("Error: unexpected problem");
                }
            }
        }
    } finally {
        // finally runs however the loop ends: quit, end of input or an error
        input.close();
        if (stretch) {
            console.log(`Session: ${commands} commands, ${ok} OK, ${errors} errors`);
        }
        console.log("Goodbye");
    }
}

await main();
