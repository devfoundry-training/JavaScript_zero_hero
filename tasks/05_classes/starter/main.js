// @ts-check
// ============================================================
// Task 05: Classes (starter)
// ============================================================
// The CSV lines from task 04 are below, plus the outline of the
// three classes. Fill in the methods marked "not implemented",
// add the validation, then write the script from the brief in
// tasks/05_classes/README.md.
//
// Run:    node tasks/05_classes/starter/main.js
// Check:  py -3.13 tasks/check/check.py 05 -- node tasks/05_classes/starter/main.js
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

class Book {
    /** Copies out on loan: private, only Book can change it */
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
        // Core 3: validate here, throw new RangeError(message)
        this.id = id;
        this.title = title;
        this.author = author;
        this.year = year;
        this.genre = genre;
        this.copies = copies;
    }

    /** Copies minus copies on loan */
    get available() {
        throw new Error(`not implemented: Book.available (on loan ${this.#onLoan})`);
    }

    /** @returns {boolean} */
    lend() {
        throw new Error("not implemented: Book.lend");
    }

    /** @returns {boolean} */
    takeBack() {
        throw new Error("not implemented: Book.takeBack");
    }

    toString() {
        return `#${this.id} ${this.title} (toString not implemented)`;
    }
}

class Member {
    /**
     * @param {number} id
     * @param {string} name
     * @param {string} email
     * @param {string} type standard, student or staff
     * @param {string} joined YYYY-MM-DD
     */
    constructor(id, name, email, type, joined) {
        // Core 3: refuse a type that is not standard, student or staff
        this.id = id;
        this.name = name;
        this.email = email;
        this.type = type;
        this.joined = joined;
        /** @type {number[]} book ids on loan */
        this.loans = [];
    }

    toString() {
        return `#${this.id} ${this.name} (toString not implemented)`;
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

    /**
     * @param {number} bookId
     * @returns {Book | undefined} undefined when there is no such book
     */
    findById(bookId) {
        throw new Error(`not implemented: findById(${bookId})`);
    }

    // Also needed: findMember, findByTitle, borrow, returnBook

    get counts() {
        return `${this.#books.size} books, ${this.#members.size} members`;
    }
}

// ------------------------------------------------------------
// Core 5: load the CSV lines and run the script
// ------------------------------------------------------------

const library = new Library();
for (const line of BOOK_LINES.slice(1)) {
    const f = line.split(",");
    library.addBook(new Book(Number(f[0]), f[1], f[2], Number(f[3]), f[4], Number(f[5])));
}
for (const line of MEMBER_LINES.slice(1)) {
    const f = line.split(",");
    library.addMember(new Member(Number(f[0]), f[1], f[2], f[3], f[4]));
}
console.log(`Library: ${library.counts}`);
console.log("not implemented: the Core script (find, borrow, return, validation)");
