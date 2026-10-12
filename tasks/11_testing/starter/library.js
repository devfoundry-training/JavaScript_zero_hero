// @ts-check
// ============================================================
// Task 10: library module (the task 09 model)
// ============================================================
// Unchanged from task 09. The new work for task 10 is in db.js:
// the rules stay here, the database only stores the rows.
// Dates are day numbers (see dates.js): + adds days, - counts them.
// ============================================================

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
// Exceptions (from task 07)
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

export class UnknownBookError extends LibraryError {
    /** @param {number} bookId */
    constructor(bookId) {
        super(`no book with id ${bookId}`);
        this.name = "UnknownBookError";
        this.bookId = bookId;
    }
}

export class UnknownMemberError extends LibraryError {
    /** @param {number} memberId */
    constructor(memberId) {
        super(`no member with id ${memberId}`);
        this.name = "UnknownMemberError";
        this.memberId = memberId;
    }
}

export class BookNotAvailableError extends LibraryError {
    /** @param {string} title */
    constructor(title) {
        super(`${title} has no copies available`);
        this.name = "BookNotAvailableError";
    }
}

export class MemberLimitReachedError extends LibraryError {
    /**
     * @param {string} name
     * @param {number} limit
     */
    constructor(name, limit) {
        super(`${name} already has ${plural(limit, "loan", "loans")} (limit ${limit})`);
        this.name = "MemberLimitReachedError";
    }
}

export class NotOnLoanError extends LibraryError {
    /**
     * @param {string} title
     * @param {string} name
     */
    constructor(title, name) {
        super(`${title} is not on loan to ${name}`);
        this.name = "NotOnLoanError";
    }
}

/** The user typed something we cannot understand. */
export class CommandError extends LibraryError {
    /**
     * @param {string} message
     * @param {ErrorOptions} [options]
     */
    constructor(message, options) {
        super(message, options);
        this.name = "CommandError";
    }
}

// ------------------------------------------------------------
// Loan policies (from task 06)
// ------------------------------------------------------------

/** @interface */
export class LoanPolicy {
    /** @returns {string} */
    get name() { throw new Error("not implemented"); }
    /** @returns {number} */
    loanDays() { throw new Error("not implemented"); }
    /** @returns {number} */
    finePerDay() { throw new Error("not implemented"); }
    /** @returns {number} */
    maxLoans() { throw new Error("not implemented"); }

    /**
     * @param {number} daysLate
     * @returns {number} pence
     */
    fineFor(daysLate) {
        return Math.max(0, daysLate) * this.finePerDay();
    }
}

class StandardPolicy extends LoanPolicy {
    get name() { return "standard"; }
    loanDays() { return 14; }
    finePerDay() { return 25; }
    maxLoans() { return 3; }
}

class StudentPolicy extends LoanPolicy {
    get name() { return "student"; }
    loanDays() { return 21; }
    finePerDay() { return 10; }
    maxLoans() { return 5; }
}

class StaffPolicy extends LoanPolicy {
    get name() { return "staff"; }
    loanDays() { return 28; }
    finePerDay() { return 0; }
    maxLoans() { return 10; }
}

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
// Books and members (from task 06)
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
     * @param {number} length
     */
    constructor(id, title, author, year, genre, copies, length) {
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

    /** @returns {string} */
    get formatName() {
        throw new Error("not implemented");
    }

    /** @returns {string} */
    lengthText() {
        throw new Error("not implemented");
    }

    describe() {
        return `#${this.id} ${this.title}: ${this.formatName}, ${this.lengthText()}`;
    }

    get available() {
        return this.copies - this.#onLoan;
    }

    /** Take a copy off the shelf, or throw BookNotAvailableError. */
    lend() {
        if (this.available === 0) {
            throw new BookNotAvailableError(this.title);
        }
        this.#onLoan++;
    }

    takeBack() {
        this.#onLoan--;
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
        return `${Math.floor(this.length / 60)}h ${String(this.length % 60).padStart(2, "0")}m`;
    }
}

const BOOK_TYPES = new Map([["print", PrintBook], ["ebook", EBook], ["audio", AudioBook]]);

/**
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
        /** @type {LoanPolicy} */
        this.policy = policyFor(type);
        /** @type {number[]} book ids still out */
        this.loans = [];
    }

    toString() {
        return `#${this.id} ${this.name} (${this.type}), ${plural(this.loans.length, "loan", "loans")}`;
    }
}

// ------------------------------------------------------------
// Loan: new in task 09
// ------------------------------------------------------------

/** @typedef {import("./dates.js").Day} Day */

export class Loan {
    /**
     * @param {number} id
     * @param {number} bookId
     * @param {number} memberId
     * @param {Day} borrowed
     * @param {Day | null} [returned] null while the book is still out
     */
    constructor(id, bookId, memberId, borrowed, returned = null) {
        /** @type {number} */
        this.id = id;
        /** @type {number} */
        this.bookId = bookId;
        /** @type {number} */
        this.memberId = memberId;
        /** @type {Day} */
        this.borrowed = borrowed;
        /** @type {Day | null} */
        this.returned = returned;
    }

    get isOpen() {
        return this.returned === null;
    }
}

// ------------------------------------------------------------
// Library: the rules
// ------------------------------------------------------------

export class Library {
    /** @type {Map<number, Book>} */
    #books = new Map();
    /** @type {Map<number, Member>} */
    #members = new Map();
    /** @type {Map<number, Loan>} */
    #loans = new Map();

    /** @param {Book} book */
    addBook(book) {
        this.#books.set(book.id, book);
    }

    /** @param {Member} member */
    addMember(member) {
        this.#members.set(member.id, member);
    }

    /**
     * Add a loan from the records. Open loans take a copy off the
     * shelf; limits are not checked (history is what it is).
     * @param {Loan} loan
     */
    addLoan(loan) {
        this.#loans.set(loan.id, loan);
        if (loan.isOpen) {
            this.book(loan.bookId).lend();
            this.member(loan.memberId).loans.push(loan.bookId);
        }
    }

    get bookCount() {
        return this.#books.size;
    }

    get memberCount() {
        return this.#members.size;
    }

    get loanCount() {
        return this.#loans.size;
    }

    allBooks() {
        return [...this.#books.values()].sort((a, b) => a.id - b.id);
    }

    allMembers() {
        return [...this.#members.values()].sort((a, b) => a.id - b.id);
    }

    allLoans() {
        return [...this.#loans.values()].sort((a, b) => a.id - b.id);
    }

    /**
     * Books whose title contains text, ignoring case, by id.
     * @param {string} text
     * @returns {Book[]}
     */
    findByTitle(text) {
        const wanted = text.toLowerCase();
        return this.allBooks().filter((book) => book.title.toLowerCase().includes(wanted));
    }

    /**
     * @param {number} bookId
     * @returns {Book | undefined}
     */
    findById(bookId) {
        return this.#books.get(bookId);
    }

    /**
     * @param {number} memberId
     * @returns {Member | undefined}
     */
    findMember(memberId) {
        return this.#members.get(memberId);
    }

    /**
     * Like findById, but a missing book is an error.
     * @param {number} bookId
     * @returns {Book}
     */
    book(bookId) {
        const found = this.#books.get(bookId);
        if (found === undefined) {
            throw new UnknownBookError(bookId);
        }
        return found;
    }

    /**
     * @param {number} memberId
     * @returns {Member}
     */
    member(memberId) {
        const found = this.#members.get(memberId);
        if (found === undefined) {
            throw new UnknownMemberError(memberId);
        }
        return found;
    }

    // --- dates and money ---------------------------------------

    /**
     * @param {Loan} loan
     * @returns {Day}
     */
    dueDate(loan) {
        return loan.borrowed + this.member(loan.memberId).policy.loanDays();
    }

    /**
     * Whole days past the due date: on the return date if the book
     * is back, otherwise today. Never negative.
     * @param {Loan} loan
     * @param {Day} today
     * @returns {number}
     */
    daysLate(loan, today) {
        const end = loan.returned ?? today;
        return Math.max(0, end - this.dueDate(loan));
    }

    /**
     * The fine in pence.
     * @param {Loan} loan
     * @param {Day} today
     * @returns {number}
     */
    fine(loan, today) {
        return this.member(loan.memberId).policy.fineFor(this.daysLate(loan, today));
    }

    /**
     * @param {Loan} loan
     * @param {Day} today
     * @returns {string}
     */
    status(loan, today) {
        const due = this.dueDate(loan);
        if (loan.returned !== null) {
            const late = this.daysLate(loan, today);
            return late === 0 ? "returned on time" : `returned ${plural(late, "day", "days")} late`;
        }
        if (today < due) {
            return `on loan, ${plural(due - today, "day", "days")} left`;
        }
        if (today === due) {
            return "due today";
        }
        return `overdue by ${plural(today - due, "day", "days")}`;
    }

    /**
     * Open loans past their due date: most days late first, then by id.
     * @param {Day} today
     * @returns {Loan[]}
     */
    overdue(today) {
        return this.allLoans()
            .filter((loan) => loan.isOpen && this.daysLate(loan, today) > 0)
            .sort((a, b) => this.daysLate(b, today) - this.daysLate(a, today) || a.id - b.id);
    }

    // --- the rules -----------------------------------------------

    /**
     * @param {number} memberId
     * @param {number} bookId
     * @param {Day} today
     * @returns {Loan}
     */
    borrow(memberId, bookId, today) {
        // The order of the checks is part of the brief
        const member = this.member(memberId);
        const book = this.book(bookId);
        const limit = member.policy.maxLoans();
        if (member.loans.length >= limit) {
            throw new MemberLimitReachedError(member.name, limit);
        }
        book.lend(); // throws BookNotAvailableError
        member.loans.push(bookId);
        const loan = new Loan(Math.max(0, ...this.#loans.keys()) + 1, bookId, memberId, today);
        this.#loans.set(loan.id, loan);
        return loan;
    }

    /**
     * @param {number} memberId
     * @param {number} bookId
     * @param {Day} today
     * @returns {Loan}
     */
    returnBook(memberId, bookId, today) {
        const member = this.member(memberId);
        const book = this.book(bookId);
        const loan = this.allLoans().find((x) => x.isOpen && x.memberId === memberId && x.bookId === bookId);
        if (loan === undefined) {
            throw new NotOnLoanError(book.title, member.name);
        }
        loan.returned = today;
        member.loans.splice(member.loans.indexOf(bookId), 1);
        book.takeBack();
        return loan;
    }
}
