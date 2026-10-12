// @ts-check
// ============================================================
// Task 07: library module (starter)
// ============================================================
// This is the task 06 model (from the task 06 solution), moved
// into its own module. borrow() and returnBook() still return
// true or false. Your job: add the exceptions below, then make
// borrow() and returnBook() throw them instead (brief, Core 1-2).
// ============================================================

// ------------------------------------------------------------
// Core 1: our own exceptions (LibraryError is started for you)
// ------------------------------------------------------------

/** Base class for every rule the library can refuse. */
export class LibraryError extends Error {
    /**
     * @param {string} message
     * @param {ErrorOptions} [options] { cause } for exception chaining
     */
    constructor(message, options) {
        super(message, options);
        this.name = "LibraryError";
    }
}

// Not implemented yet: UnknownBookError, UnknownMemberError,
// BookNotAvailableError, MemberLimitReachedError, NotOnLoanError
// and CommandError, each extending LibraryError and building its
// own message (see the table in the brief).

// ------------------------------------------------------------
// The task 06 model
// ------------------------------------------------------------

/**
 * @param {number} count
 * @param {string} singular
 * @param {string} many
 * @returns {string}
 */
export function plural(count, singular, many) {
    return `${count} ${count === 1 ? singular : many}`;
}

/**
 * Whole pence to pounds: 125 -> "£1.25". Integer maths only.
 * @param {number} pence
 * @returns {string}
 */
export function formatMoney(pence) {
    return `£${Math.floor(pence / 100)}.${String(pence % 100).padStart(2, "0")}`;
}

// ------------------------------------------------------------
// Loan policies: one interface, three (plus one) implementations
// ------------------------------------------------------------
// JavaScript has no interface keyword. LoanPolicy plays the part:
// the methods every policy must provide throw until a subclass
// overrides them, and fineFor is shared behaviour they all inherit.

/** @interface */
export class LoanPolicy {
    /** @returns {string} */
    get name() {
        throw new Error("not implemented");
    }

    /** @returns {number} */
    loanDays() {
        throw new Error("not implemented");
    }

    /** @returns {number} pence charged for each day late */
    finePerDay() {
        throw new Error("not implemented");
    }

    /** @returns {number} */
    maxLoans() {
        throw new Error("not implemented");
    }

    /**
     * Shared behaviour: days late times the daily fine, never below 0.
     * @param {number} daysLate
     * @returns {number} pence
     */
    fineFor(daysLate) {
        return Math.max(0, daysLate) * this.finePerDay();
    }

    describe() {
        const fine = this.finePerDay() === 0 ? "no fines" : `${formatMoney(this.finePerDay())} a day`;
        return `${this.name}: ${this.loanDays()} days, ${fine}, up to ${plural(this.maxLoans(), "loan", "loans")}`;
    }
}

/** @implements {LoanPolicy} */
class StandardPolicy extends LoanPolicy {
    get name() { return "standard"; }
    loanDays() { return 14; }
    finePerDay() { return 25; }
    maxLoans() { return 3; }
}

/** @implements {LoanPolicy} */
class StudentPolicy extends LoanPolicy {
    get name() { return "student"; }
    loanDays() { return 21; }
    finePerDay() { return 10; }
    maxLoans() { return 5; }
}

/** @implements {LoanPolicy} */
class StaffPolicy extends LoanPolicy {
    get name() { return "staff"; }
    loanDays() { return 28; }
    finePerDay() { return 0; }
    maxLoans() { return 10; }
}

/** The one place that maps a type name to a policy */
const POLICIES = new Map([
    ["standard", new StandardPolicy()],
    ["student", new StudentPolicy()],
    ["staff", new StaffPolicy()],
]);

/**
 * @param {string} memberType
 * @returns {LoanPolicy}
 */
export function policyFor(memberType) {
    const policy = POLICIES.get(memberType);
    if (policy === undefined) {
        throw new RangeError("member type must be standard, student or staff");
    }
    return policy;
}

// ------------------------------------------------------------
// Books: an abstract base and three concrete types
// ------------------------------------------------------------

export class Book {
    #onLoan = 0;

    /**
     * @param {number} id
     * @param {string} title
     * @param {string} author
     * @param {number} year
     * @param {string} genre
     * @param {number} copies
     * @param {number} length pages, or minutes for audio
     */
    constructor(id, title, author, year, genre, copies, length) {
        // new.target is the class named after "new": stop "new Book(...)"
        if (new.target === Book) {
            throw new TypeError("Book is abstract: make a PrintBook, EBook or AudioBook");
        }
        if (id <= 0) {
            throw new RangeError("book id must be positive");
        }
        if (title.trim() === "") {
            throw new RangeError("title must not be blank");
        }
        if (year < 1450 || year > 2100) {
            throw new RangeError("year must be between 1450 and 2100");
        }
        if (copies < 0) {
            throw new RangeError("copies must not be negative");
        }
        if (length <= 0) {
            throw new RangeError("length must be positive");
        }
        /** @type {number} */
        this.id = id;
        /** @type {string} */
        this.title = title;
        /** @type {string} */
        this.author = author;
        /** @type {number} */
        this.year = year;
        /** @type {string} */
        this.genre = genre;
        /** @type {number} */
        this.copies = copies;
        /** @type {number} */
        this.length = length;
    }

    /** @returns {string} "print", "ebook" or "audio" (abstract) */
    get formatName() {
        throw new Error("not implemented");
    }

    /** @returns {string} each type says how long it is in its own way (abstract) */
    lengthText() {
        throw new Error("not implemented");
    }

    describe() {
        // Polymorphism: the same call works for every book type
        return `#${this.id} ${this.title}: ${this.formatName}, ${this.lengthText()}`;
    }

    get available() {
        return this.copies - this.#onLoan;
    }

    /** @returns {boolean} */
    lend() {
        if (this.available === 0) {
            return false;
        }
        this.#onLoan++;
        return true;
    }

    /** @returns {boolean} */
    takeBack() {
        if (this.#onLoan === 0) {
            return false;
        }
        this.#onLoan--;
        return true;
    }

    toString() {
        return `#${this.id} ${this.title} by ${this.author} (${this.year}), ${this.available} of ${this.copies} available`;
    }

    /** @param {unknown} other */
    equals(other) {
        return other instanceof Book && other.id === this.id;
    }
}

export class PrintBook extends Book {
    get formatName() { return "print"; }
    lengthText() { return `${this.length} pages`; }
}

export class EBook extends Book {
    get formatName() { return "ebook"; }
    lengthText() { return `${this.length} pages`; }
}

export class AudioBook extends Book {
    get formatName() { return "audio"; }

    lengthText() {
        // length is in minutes: 1150 -> 19h 10m
        return `${Math.floor(this.length / 60)}h ${String(this.length % 60).padStart(2, "0")}m`;
    }
}

const BOOK_TYPES = new Map([["print", PrintBook], ["ebook", EBook], ["audio", AudioBook]]);

/**
 * Factory: the format column decides which class to build.
 * @param {string[]} fields the eight columns of books.csv
 * @returns {Book}
 */
export function makeBook(fields) {
    const BookType = BOOK_TYPES.get(fields[6]);
    if (BookType === undefined) {
        throw new RangeError(`format must be print, ebook or audio, got '${fields[6]}'`);
    }
    return new BookType(Number(fields[0]), fields[1], fields[2], Number(fields[3]), fields[4], Number(fields[5]),
        Number(fields[7]));
}

export class Member {
    /**
     * @param {number} id
     * @param {string} name
     * @param {string} email
     * @param {string} type
     * @param {string} joined
     */
    constructor(id, name, email, type, joined) {
        if (id <= 0) {
            throw new RangeError("member id must be positive");
        }
        if (name.trim() === "") {
            throw new RangeError("name must not be blank");
        }
        /** @type {number} */
        this.id = id;
        /** @type {string} */
        this.name = name;
        /** @type {string} */
        this.email = email;
        /** @type {string} */
        this.type = type;
        /** @type {string} */
        this.joined = joined;
        /** @type {LoanPolicy} chosen once, from the type */
        this.policy = policyFor(type);
        /** @type {number[]} */
        this.loans = [];
    }

    canBorrowMore() {
        return this.loans.length < this.policy.maxLoans();
    }

    toString() {
        return `#${this.id} ${this.name} (${this.type}), ${plural(this.loans.length, "loan", "loans")}`;
    }
}

export class Library {
    /** @type {Map<number, Book>} */
    #books = new Map();
    /** @type {Map<number, Member>} */
    #members = new Map();

    /** @param {Book} book */
    addBook(book) {
        this.#books.set(book.id, book);
    }

    /** @param {Member} member */
    addMember(member) {
        this.#members.set(member.id, member);
    }

    /** @param {number} bookId */
    findById(bookId) {
        return this.#books.get(bookId);
    }

    /** @param {number} memberId */
    findMember(memberId) {
        return this.#members.get(memberId);
    }

    allBooks() {
        return [...this.#books.values()].sort((a, b) => a.id - b.id);
    }

    /**
     * @param {number} memberId
     * @param {number} bookId
     * @returns {boolean}
     */
    borrow(memberId, bookId) {
        const member = this.findMember(memberId);
        const book = this.findById(bookId);
        if (member === undefined || book === undefined) {
            return false;
        }
        if (!member.canBorrowMore()) { // the policy decides the limit
            return false;
        }
        if (!book.lend()) {
            return false;
        }
        member.loans.push(bookId);
        return true;
    }

    /**
     * @param {number} memberId
     * @param {number} bookId
     * @returns {boolean}
     */
    returnBook(memberId, bookId) {
        const member = this.findMember(memberId);
        const book = this.findById(bookId);
        if (member === undefined || book === undefined || !member.loans.includes(bookId)) {
            return false;
        }
        member.loans.splice(member.loans.indexOf(bookId), 1);
        book.takeBack();
        return true;
    }
}
