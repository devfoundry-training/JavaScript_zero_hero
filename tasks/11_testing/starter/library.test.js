// @ts-check
// ============================================================
// Task 11: Test the rules (starter)
// ============================================================
// library.js, storage.js and dates.js are the task 10 solution
// (the task 09 model). The fixture and the first test are written
// for you; replace each assert.fail("not implemented") with a real
// test, then add reservations test first (brief, Core 3).
//
// Run:    node --test tasks/11_testing/starter/library.test.js
// Check:  py -3.13 tasks/check/check.py 11 -- node --test tasks/11_testing/starter/library.test.js
// ============================================================

import assert from "node:assert/strict";
import { beforeEach, describe, test } from "node:test";

import { parseDate } from "./dates.js";
import { Library, Member, makeBook } from "./library.js";

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
        library = fixture(); // a fresh library for every test
    });

    // A finished example: arrange (beforeEach), act, assert
    test("borrow reduces available", () => {
        library.borrow(AMIRA, 4, TODAY);
        assert.equal(library.book(4).available, 3);
    });

    test("return restores available", () => {
        assert.fail("not implemented");
    });

    test("borrow unknown book raises", () => {
        assert.fail("not implemented");
    });

    test("borrow unknown member raises", () => {
        assert.fail("not implemented");
    });

    test("borrow with no copies raises", () => {
        assert.fail("not implemented");
    });

    test("return book not on loan raises", () => {
        assert.fail("not implemented");
    });

    test("standard limit is three loans", () => {
        assert.fail("not implemented");
    });

    test("student limit is five loans", () => {
        assert.fail("not implemented");
    });
});

describe("dates and fines", () => {
    test("due date standard is 14 days", () => {
        assert.fail("not implemented");
    });

    test("due date student is 21 days", () => {
        assert.fail("not implemented");
    });

    test("due date staff is 28 days", () => {
        assert.fail("not implemented");
    });

    test("due date crosses month and year end", () => {
        assert.fail("not implemented");
    });

    test("due date in leap year", () => {
        assert.fail("not implemented");
    });

    test("not overdue on due date", () => {
        assert.fail("not implemented");
    });

    test("fine one day late standard", () => {
        assert.fail("not implemented");
    });

    test("fine ten days late student", () => {
        assert.fail("not implemented");
    });

    test("staff never fined", () => {
        assert.fail("not implemented");
    });

    test("late return fine uses return date", () => {
        assert.fail("not implemented");
    });

    test("format money", () => {
        assert.fail("not implemented");
    });
});

// In each reservation test, 101 has first borrowed book 5 (the only copy)
describe("reservations", () => {
    test("reserve book with no free copies joins queue", () => {
        assert.fail("not implemented");
    });

    test("reserve book with free copies raises", () => {
        assert.fail("not implemented");
    });

    test("reserve same book twice raises", () => {
        assert.fail("not implemented");
    });

    test("returned copy is held for first in queue", () => {
        assert.fail("not implemented");
    });

    test("first in queue can borrow held copy", () => {
        assert.fail("not implemented");
    });

    test("queue is first come first served", () => {
        assert.fail("not implemented");
    });
});
