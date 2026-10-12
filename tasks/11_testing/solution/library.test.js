// @ts-check
// ============================================================
// Task 11: Test the rules (solution, Core + Stretch)
// ============================================================
// Session 11: testing. Every test builds a fresh library in
// beforeEach, so no test depends on another one or on the order
// they run in. Dates are fixed values: nothing reads the real clock.
//
// Run:  node --test tasks/11_testing/solution/library.test.js
// The default reporter prints the name of every test it runs.
// ============================================================

import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";
import { beforeEach, describe, test } from "node:test";
import { fileURLToPath } from "node:url";

import { formatDate, parseDate } from "./dates.js";
import {
    AlreadyReservedError, BookNotAvailableError, Library, Loan, Member, MemberLimitReachedError, NotOnLoanError,
    ReservationNotNeededError, UnknownBookError, UnknownMemberError, formatMoney, makeBook,
} from "./library.js";
import { loadBooksCsv } from "./storage.js";

const TODAY = parseDate("2026-10-12");

// The fixture: books 1-8 of books.csv and members 101-103, no loans
const FIXTURE_BOOKS = [
    "1,Pride and Prejudice,Jane Austen,1813,Classic,3,print,432",
    "2,Nineteen Eighty-Four,George Orwell,1949,Dystopian,2,print,328",
    "3,The Hobbit,J. R. R. Tolkien,1937,Fantasy,0,print,310",
    "4,Dune,Frank Herbert,1965,Science Fiction,4,print,412",
    "5,Robinson Crusoe,Daniel Defoe,1719,Adventure,1,print,320",
    "6,The Time Machine,H. G. Wells,1895,Science Fiction,2,ebook,118",
    "7,Animal Farm,George Orwell,1945,Dystopian,5,print,112",
    "8,Emma,Jane Austen,1815,Classic,1,audio,1150",
];
const AMIRA = 101; // standard
const BEN = 102; // student
const CHLOE = 103; // staff

/** @returns {Library} */
function fixture() {
    const library = new Library();
    for (const line of FIXTURE_BOOKS) {
        library.addBook(makeBook(line.split(",")));
    }
    library.addMember(new Member(AMIRA, "Amira Khan", "amira.khan@example.com", "standard", "2023-01-15"));
    library.addMember(new Member(BEN, "Ben Taylor", "ben.taylor@example.com", "student", "2024-09-02"));
    library.addMember(new Member(CHLOE, "Chloe Evans", "chloe.evans@example.com", "staff", "2019-05-20"));
    return library;
}

describe("borrowing", () => {
    /** @type {Library} */
    let library;
    beforeEach(() => {
        library = fixture();
    });

    test("borrow reduces available", () => {
        library.borrow(AMIRA, 4, TODAY);
        assert.equal(library.book(4).available, 3);
    });

    test("return restores available", () => {
        library.borrow(AMIRA, 4, TODAY);
        library.returnBook(AMIRA, 4, TODAY);
        assert.equal(library.book(4).available, 4);
    });

    test("borrow unknown book raises", () => {
        assert.throws(() => library.borrow(AMIRA, 99, TODAY), UnknownBookError);
    });

    test("borrow unknown member raises", () => {
        assert.throws(() => library.borrow(999, 1, TODAY), UnknownMemberError);
    });

    test("borrow with no copies raises", () => {
        assert.throws(() => library.borrow(AMIRA, 3, TODAY), BookNotAvailableError);
    });

    test("return book not on loan raises", () => {
        assert.throws(() => library.returnBook(AMIRA, 4, TODAY), NotOnLoanError);
    });

    test("standard limit is three loans", () => {
        for (const bookId of [1, 2, 4]) {
            library.borrow(AMIRA, bookId, TODAY);
        }
        assert.throws(() => library.borrow(AMIRA, 7, TODAY), MemberLimitReachedError);
    });

    test("student limit is five loans", () => {
        for (const bookId of [1, 2, 4, 6, 7]) {
            library.borrow(BEN, bookId, TODAY);
        }
        assert.throws(() => library.borrow(BEN, 8, TODAY), MemberLimitReachedError);
    });
});

describe("dates and fines", () => {
    /** @type {Library} */
    let library;
    beforeEach(() => {
        library = fixture();
    });

    /**
     * The due date, as text, of a loan built directly.
     * @param {number} memberId
     * @param {string} borrowed
     */
    function due(memberId, borrowed) {
        const loan = new Loan(1, 1, memberId, parseDate(borrowed));
        return formatDate(library.dueDate(loan));
    }

    test("due date standard is 14 days", () => {
        assert.equal(due(AMIRA, "2026-10-12"), "2026-10-26");
    });

    test("due date student is 21 days", () => {
        assert.equal(due(BEN, "2026-10-12"), "2026-11-02");
    });

    test("due date staff is 28 days", () => {
        assert.equal(due(CHLOE, "2026-10-12"), "2026-11-09");
    });

    test("due date crosses month and year end", () => {
        assert.equal(due(BEN, "2026-12-20"), "2027-01-10");
    });

    test("due date in leap year", () => {
        assert.equal(due(AMIRA, "2028-02-20"), "2028-03-05");
    });

    test("not overdue on due date", () => {
        const loan = new Loan(1, 1, AMIRA, parseDate("2026-09-28")); // due 2026-10-12
        assert.equal(library.daysLate(loan, TODAY), 0);
        assert.equal(library.fine(loan, TODAY), 0);
    });

    test("fine one day late standard", () => {
        const loan = new Loan(1, 1, AMIRA, parseDate("2026-09-27")); // due 2026-10-11
        assert.equal(library.fine(loan, TODAY), 25);
    });

    test("fine ten days late student", () => {
        const loan = new Loan(1, 1, BEN, parseDate("2026-09-11")); // due 2026-10-02
        assert.equal(library.fine(loan, TODAY), 100);
    });

    test("staff never fined", () => {
        const loan = new Loan(1, 1, CHLOE, parseDate("2026-01-01"));
        assert.equal(library.fine(loan, TODAY), 0);
    });

    test("late return fine uses return date", () => {
        // Due 2026-10-01, back 2026-10-05: 4 days late, whatever today is
        const loan = new Loan(1, 1, AMIRA, parseDate("2026-09-17"), parseDate("2026-10-05"));
        assert.equal(library.fine(loan, parseDate("2026-12-25")), 100);
    });

    test("format money", () => {
        assert.equal(formatMoney(0), "£0.00");
        assert.equal(formatMoney(5), "£0.05");
        assert.equal(formatMoney(125), "£1.25");
        assert.equal(formatMoney(1000), "£10.00");
    });
});

// Written first, watched fail, then made to pass (TDD)
describe("reservations", () => {
    /** @type {Library} */
    let library;
    beforeEach(() => {
        library = fixture();
        library.borrow(AMIRA, 5, TODAY); // the only copy of Robinson Crusoe
    });

    test("reserve book with no free copies joins queue", () => {
        assert.equal(library.reserve(BEN, 5), 1);
        assert.equal(library.reserve(CHLOE, 5), 2);
    });

    test("reserve book with free copies raises", () => {
        assert.throws(() => library.reserve(BEN, 1), ReservationNotNeededError);
    });

    test("reserve same book twice raises", () => {
        library.reserve(BEN, 5);
        assert.throws(() => library.reserve(BEN, 5), AlreadyReservedError);
    });

    test("returned copy is held for first in queue", () => {
        library.reserve(BEN, 5);
        library.returnBook(AMIRA, 5, TODAY);
        assert.throws(() => library.borrow(CHLOE, 5, TODAY), BookNotAvailableError);
    });

    test("first in queue can borrow held copy", () => {
        library.reserve(BEN, 5);
        library.returnBook(AMIRA, 5, TODAY);
        library.borrow(BEN, 5, TODAY);
        assert.equal(library.book(5).available, 0);
        assert.deepEqual(library.heldFor(5), []);
    });

    test("queue is first come first served", () => {
        library.reserve(CHLOE, 5);
        library.reserve(BEN, 5);
        library.returnBook(AMIRA, 5, TODAY);
        assert.deepEqual(library.heldFor(5), [CHLOE]);
        assert.deepEqual(library.queueFor(5), [BEN]);
    });
});

// ------------------------------------------------------------
// Stretch: the file loader, and a table of cases as sub-tests
// ------------------------------------------------------------

/**
 * Walk up from this file to the first folder holding data/books.csv.
 * @returns {string}
 */
function findDataDir() {
    let folder = path.dirname(fileURLToPath(import.meta.url));
    while (true) {
        if (fs.existsSync(path.join(folder, "data", "books.csv"))) {
            return path.join(folder, "data");
        }
        const parent = path.dirname(folder);
        if (parent === folder) {
            throw new Error("could not find the data folder");
        }
        folder = parent;
    }
}

describe("stretch", () => {
    test("corrupt csv loads good lines only", () => {
        const result = loadBooksCsv(path.join(findDataDir(), "books_corrupt.csv"));
        assert.deepEqual(result.books.map((book) => book.id), [1, 2, 4, 6, 10]);
        assert.equal(result.skipped, 5);
    });

    test("fines table", async (t) => {
        const library = fixture();
        const cases = [ // [member, days late, expected pence]
            [AMIRA, 0, 0], [AMIRA, 1, 25], [AMIRA, 20, 500],
            [BEN, 1, 10], [BEN, 30, 300], [CHLOE, 365, 0],
        ];
        for (const [memberId, days, pence] of cases) {
            await t.test(`member ${memberId}, ${days} days late, ${pence}p`, () => {
                assert.equal(library.member(memberId).policy.fineFor(days), pence);
            });
        }
    });
});
