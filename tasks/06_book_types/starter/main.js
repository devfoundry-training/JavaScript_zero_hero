// @ts-check
// ============================================================
// Task 06: Book types and loan policies (starter)
// ============================================================
// Below is the task 05 solution (Book, Member, Library and the
// CSV lines), so you can start here without finishing task 05.
// Change Book into an abstract base with PrintBook, EBook and
// AudioBook, add the LoanPolicy classes, then run the script from
// the brief in tasks/06_book_types/README.md.
//
// Run:    node tasks/06_book_types/starter/main.js
// Check:  py -3.13 tasks/check/check.py 06 -- node tasks/06_book_types/starter/main.js
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

const MEMBER_TYPES = ["standard", "student", "staff"];

/**
 * "1 loan" or "3 loans": the number and the right noun.
 * @param {number} count
 * @param {string} singular
 * @param {string} many
 * @returns {string}
 */
function plural(count, singular, many) {
    return `${count} ${count === 1 ? singular : many}`;
}

// ------------------------------------------------------------
// Book: validated on the way in, knows how many are on loan
// ------------------------------------------------------------

class Book {
    /** Copies out on loan. # makes it private: only Book can touch it. */
    #onLoan = 0;

    /**
     * @param {number} id
     * @param {string} title
     * @param {string} author
     * @param {number} year
     * @param {string} genre
     * @param {number} copies
     */
    constructor(id, title, author, year, genre, copies) {
        // Validation in the constructor: a Book that exists is valid
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
    }

    /** Copies on the shelf. A getter: read like a field, worked out each time. */
    get available() {
        return this.copies - this.#onLoan;
    }

    /** @returns {boolean} false when no copy is left */
    lend() {
        if (this.available === 0) {
            return false;
        }
        this.#onLoan++;
        return true;
    }

    /** @returns {boolean} false when nothing was on loan */
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

    /**
     * Stretch 1: identity is the id, whatever the other fields say.
     * (=== on two objects only asks "is it the same object?")
     * @param {unknown} other
     * @returns {boolean}
     */
    equals(other) {
        return other instanceof Book && other.id === this.id;
    }

    /**
     * Stretch 2: natural order, title A-Z ignoring case, then year.
     * Pass it to sort: books.sort(Book.compare)
     * @param {Book} a
     * @param {Book} b
     * @returns {number}
     */
    static compare(a, b) {
        const x = a.title.toLowerCase();
        const y = b.title.toLowerCase();
        if (x !== y) {
            return x < y ? -1 : 1;
        }
        return a.year - b.year;
    }
}

class Member {
    /**
     * @param {number} id
     * @param {string} name
     * @param {string} email
     * @param {string} type standard, student or staff
     * @param {string} joined YYYY-MM-DD, kept as text in this task
     */
    constructor(id, name, email, type, joined) {
        if (id <= 0) {
            throw new RangeError("member id must be positive");
        }
        if (name.trim() === "") {
            throw new RangeError("name must not be blank");
        }
        if (!MEMBER_TYPES.includes(type)) {
            throw new RangeError("member type must be standard, student or staff");
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
        /** @type {number[]} book ids on loan */
        this.loans = [];
    }

    toString() {
        return `#${this.id} ${this.name} (${this.type}), ${plural(this.loans.length, "loan", "loans")}`;
    }
}

// ------------------------------------------------------------
// Library: owns the books and members, and the borrowing rules
// ------------------------------------------------------------

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

    get bookCount() {
        return this.#books.size;
    }

    get memberCount() {
        return this.#members.size;
    }

    /**
     * The book, or undefined when there is no such id (what Map.get gives).
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

    /** @returns {Book[]} every book, by id */
    allBooks() {
        return [...this.#books.values()].sort((a, b) => a.id - b.id);
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

    /** Stretch 3: books with at least one copy on the shelf. */
    availableBooks() {
        return this.allBooks().filter((book) => book.available > 0);
    }
}

// ------------------------------------------------------------
// New in task 06 (stubs to fill in)
// ------------------------------------------------------------

/**
 * Whole pence to pounds: 125 -> "£1.25". Integer maths only.
 * @param {number} pence
 * @returns {string}
 */
function formatMoney(pence) {
    throw new Error(`not implemented: formatMoney(${pence})`);
}

/**
 * The interface every policy provides. JavaScript has no interface
 * keyword: these methods throw until a subclass overrides them.
 * @interface
 */
class LoanPolicy {
    /** @returns {string} */
    get name() { throw new Error("not implemented"); }
    /** @returns {number} */
    loanDays() { throw new Error("not implemented"); }
    /** @returns {number} pence per day late */
    finePerDay() { throw new Error("not implemented"); }
    /** @returns {number} */
    maxLoans() { throw new Error("not implemented"); }

    /**
     * Days late times the daily fine, never below 0.
     * @param {number} daysLate
     * @returns {number} pence
     */
    fineFor(daysLate) {
        throw new Error(`not implemented: fineFor(${daysLate})`);
    }
}

// Also needed: StandardPolicy, StudentPolicy, StaffPolicy,
// PrintBook, EBook, AudioBook and makeBook(fields).

/**
 * Factory: the format column (fields[6]) decides the class.
 * @param {string[]} fields
 * @returns {Book}
 */
function makeBook(fields) {
    throw new Error(`not implemented: makeBook for format '${fields[6]}'`);
}

// ------------------------------------------------------------
// The Core script
// ------------------------------------------------------------

const library = new Library();
for (const line of MEMBER_LINES.slice(1)) {
    const f = line.split(",");
    library.addMember(new Member(Number(f[0]), f[1], f[2], f[3], f[4]));
}
console.log(`not implemented: the task 06 script (${BOOK_LINES.length - 1} books to load with makeBook, `
    + `${library.memberCount} members loaded)`);
