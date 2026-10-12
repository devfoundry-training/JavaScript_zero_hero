// @ts-check
// ============================================================
// Task 12: api module, the library over HTTP, JSON in and out
// ============================================================
// Core endpoints:
//   GET  /books              every book, by id
//   GET  /books?title=TEXT   books whose title contains TEXT (any case)
//   POST /loans              {"member_id": 101, "book_id": 4}
// Stretch endpoints:
//   GET  /books/ID               one book
//   GET  /books/ID/openlibrary   Open Library's first match for it
//
// Node runs our JavaScript on one thread, so two requests never
// change the library at the same moment: each handler does its
// checks and changes with no await in between. (Compare the
// Python reference, which needs a lock for its threads.)
// ============================================================

import * as http from "node:http";

import { formatDate } from "./dates.js";
import { Book, Library, LibraryError, UnknownBookError, UnknownMemberError } from "./library.js";
import * as openlibrary from "./openlibrary.js";

/** @typedef {import("./dates.js").Day} Day */
/** @typedef {{ status: number, body: unknown }} Reply */

const BAD_BODY = "body must be a JSON object with whole-number member_id and book_id";

/**
 * @param {Library} library
 * @param {Book} book
 */
function bookJson(library, book) {
    return {
        id: book.id,
        title: book.title,
        author: book.author,
        year: book.year,
        genre: book.genre,
        format: book.formatName,
        copies: book.copies,
        available: library.freeCopies(book.id),
    };
}

/**
 * The HTTP-free part: takes simple values, returns a status and a
 * body. Keeping it apart from the server makes it easy to test.
 */
export class LibraryApi {
    /**
     * @param {Library} library
     * @param {Day} today
     */
    constructor(library, today) {
        this.library = library;
        this.today = today;
    }

    /**
     * @param {string | null} title
     * @returns {Reply}
     */
    listBooks(title) {
        const books = title ? this.library.findByTitle(title) : this.library.allBooks();
        return { status: 200, body: books.map((book) => bookJson(this.library, book)) };
    }

    /**
     * @param {number} bookId
     * @returns {Reply}
     */
    getBook(bookId) {
        const book = this.library.findById(bookId);
        if (book === undefined) {
            return { status: 404, body: { error: `no book with id ${bookId}` } };
        }
        return { status: 200, body: bookJson(this.library, book) };
    }

    /**
     * @param {string} text the request body
     * @returns {Reply}
     */
    createLoan(text) {
        /** @type {any} */
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            return { status: 400, body: { error: BAD_BODY } };
        }
        // Number.isInteger is false for "101", 4.5, true and null. (JSON.parse
        // turns 4.0 into 4, so JavaScript cannot tell those two apart.)
        if (typeof data !== "object" || data === null || Array.isArray(data)
            || !Number.isInteger(data.member_id) || !Number.isInteger(data.book_id)) {
            return { status: 400, body: { error: BAD_BODY } };
        }
        try {
            const loan = this.library.borrow(data.member_id, data.book_id, this.today);
            return {
                status: 201,
                body: {
                    id: loan.id,
                    book_id: loan.bookId,
                    member_id: loan.memberId,
                    borrowed: formatDate(loan.borrowed),
                    due: formatDate(this.library.dueDate(loan)),
                },
            };
        } catch (error) {
            if (error instanceof UnknownMemberError || error instanceof UnknownBookError) {
                return { status: 404, body: { error: error.message } };
            }
            if (error instanceof LibraryError) {
                return { status: 409, body: { error: error.message } }; // a rule said no: a conflict
            }
            throw error;
        }
    }

    /**
     * Stretch 3: a live call to Open Library for one of our books.
     * @param {number} bookId
     * @returns {Promise<Reply>}
     */
    async openLibrary(bookId) {
        const book = this.library.findById(bookId);
        if (book === undefined) {
            return { status: 404, body: { error: `no book with id ${bookId}` } };
        }
        try {
            const match = openlibrary.firstMatch(await openlibrary.search(book.title, 1));
            return { status: 200, body: { id: book.id, title: book.title, open_library: match } };
        } catch {
            return { status: 502, body: { error: "Open Library did not answer" } };
        }
    }
}

/**
 * The whole request body as text, collected from the "data" events.
 * @param {http.IncomingMessage} request
 * @returns {Promise<string>}
 */
async function readBody(request) {
    /** @type {Buffer[]} */
    const chunks = [];
    for await (const chunk of request) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString("utf8");
}

/**
 * @param {http.ServerResponse} response
 * @param {Reply} reply
 */
function sendJson(response, { status, body }) {
    const payload = JSON.stringify(body);
    response.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": Buffer.byteLength(payload),
    });
    response.end(payload);
}

/**
 * Work out which endpoint a request is for and answer it.
 * @param {LibraryApi} api
 * @param {http.IncomingMessage} request
 * @returns {Promise<Reply>}
 */
async function route(api, request) {
    const url = new URL(request.url ?? "/", "http://localhost");
    const parts = url.pathname.split("/").filter((part) => part !== "");
    const isId = (/** @type {string} */ text) => /^[0-9]+$/.test(text);

    if (request.method === "GET" && parts.length === 1 && parts[0] === "books") {
        return api.listBooks(url.searchParams.get("title")); // get() decodes %20
    }
    if (request.method === "GET" && parts.length === 2 && parts[0] === "books" && isId(parts[1])) {
        return api.getBook(Number(parts[1]));
    }
    if (request.method === "GET" && parts.length === 3 && parts[0] === "books" && isId(parts[1])
        && parts[2] === "openlibrary") {
        return api.openLibrary(Number(parts[1]));
    }
    if (request.method === "POST" && parts.length === 1 && parts[0] === "loans") {
        return api.createLoan(await readBody(request));
    }
    return { status: 404, body: { error: "not found" } };
}

/**
 * Create the server (not yet listening).
 * @param {Library} library
 * @param {Day} today
 * @returns {http.Server}
 */
export function createServer(library, today) {
    const api = new LibraryApi(library, today);
    return http.createServer(async (request, response) => {
        try {
            const reply = await route(api, request);
            console.error(`${request.method} ${request.url} -> ${reply.status}`); // a short log line on stderr
            sendJson(response, reply);
        } catch (error) {
            console.error(error);
            sendJson(response, { status: 500, body: { error: "unexpected problem" } });
        }
    });
}
