// @ts-check
// ============================================================
// Task 06: Book types and loan policies (solution, Core + Stretch)
// ============================================================
// Session 6: inheritance, interfaces, polymorphism. Builds on 05:
//   * Book becomes abstract, with PrintBook, EBook and AudioBook
//   * LoanPolicy is an interface with three implementations, and
//     each member gets the policy for their member type
//
// Run:  node tasks/06_book_types/solution/main.js             (Core, checked)
//       node tasks/06_book_types/solution/main.js --stretch   (Core, then the Stretch)
// ============================================================

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

/**
 * @param {number} count
 * @param {string} singular
 * @param {string} many
 * @returns {string}
 */
function plural(count, singular, many) {
    return `${count} ${count === 1 ? singular : many}`;
}

/**
 * Whole pence to pounds: 125 -> "£1.25". Integer maths only.
 * @param {number} pence
 * @returns {string}
 */
function formatMoney(pence) {
    return `£${Math.floor(pence / 100)}.${String(pence % 100).padStart(2, "0")}`;
}

// ------------------------------------------------------------
// Loan policies: one interface, three (plus one) implementations
// ------------------------------------------------------------
// JavaScript has no interface keyword. LoanPolicy plays the part:
// the methods every policy must provide throw until a subclass
// overrides them, and fineFor is shared behaviour they all inherit.

/** @interface */
class LoanPolicy {
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

/**
 * Stretch 1: a new policy, added without touching Library or Member.
 * @implements {LoanPolicy}
 */
class GuestPolicy extends LoanPolicy {
    get name() { return "guest"; }
    loanDays() { return 7; }
    finePerDay() { return 50; }
    maxLoans() { return 1; }
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
function policyFor(memberType) {
    const policy = POLICIES.get(memberType);
    if (policy === undefined) {
        throw new RangeError("member type must be standard, student or staff");
    }
    return policy;
}

// ------------------------------------------------------------
// Books: an abstract base and three concrete types
// ------------------------------------------------------------

class Book {
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

class PrintBook extends Book {
    get formatName() { return "print"; }
    lengthText() { return `${this.length} pages`; }
}

class EBook extends Book {
    get formatName() { return "ebook"; }
    lengthText() { return `${this.length} pages`; }
}

class AudioBook extends Book {
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
function makeBook(fields) {
    const BookType = BOOK_TYPES.get(fields[6]);
    if (BookType === undefined) {
        throw new RangeError(`format must be print, ebook or audio, got '${fields[6]}'`);
    }
    return new BookType(Number(fields[0]), fields[1], fields[2], Number(fields[3]), fields[4], Number(fields[5]),
        Number(fields[7]));
}

class Member {
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

class Library {
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
// The Core script
// ------------------------------------------------------------

const library = loadLibrary();

console.log("Formats");
for (const book of library.allBooks()) {
    console.log(book.describe());
}

console.log("Policies");
for (const policy of POLICIES.values()) {
    console.log(policy.describe());
}

console.log("Fine for 3 days late");
for (const policy of POLICIES.values()) {
    console.log(`${policy.name}: ${formatMoney(policy.fineFor(3))}`);
}

console.log("Limits");
for (const [memberId, bookId] of [[101, 1], [101, 2], [101, 4], [101, 7], [102, 7], [103, 7]]) {
    const member = library.findMember(memberId);
    if (library.borrow(memberId, bookId) && member !== undefined) {
        console.log(`borrow ${memberId} ${bookId}: OK, due in ${member.policy.loanDays()} days`);
    } else {
        console.log(`borrow ${memberId} ${bookId}: refused`);
    }
}

if (process.argv.includes("--stretch")) {
    console.log("Stretch");
    console.log(new GuestPolicy().describe());
    /** @type {Map<string, number>} */
    const counts = new Map();
    for (const book of library.allBooks()) {
        counts.set(book.formatName, (counts.get(book.formatName) ?? 0) + 1); // no instanceof needed
    }
    console.log(`formats: ${["print", "ebook", "audio"].map((name) => `${name} ${counts.get(name)}`).join(", ")}`);
}
