// @ts-check
// ============================================================
// Task 12: api module (starter)
// ============================================================
// The server runs, but every request gets a 501 "not implemented"
// answer. Replace route() with the three Core endpoints from the
// brief, plus a JSON 404 for anything else:
//   GET /books, GET /books?title=TEXT, POST /loans
// new URL(request.url, "http://localhost") splits the path and the
// query; url.searchParams.get("title") decodes %20 for you.
// ============================================================

import * as http from "node:http";

import { Library } from "./library.js";

/** @typedef {import("./dates.js").Day} Day */
/** @typedef {{ status: number, body: unknown }} Reply */

/**
 * @param {Library} library
 * @param {Day} today
 * @param {http.IncomingMessage} request
 * @returns {Promise<Reply>}
 */
async function route(library, today, request) {
    // library and today are ready for your endpoints
    return { status: 501, body: { error: `not implemented: ${request.method} ${request.url}` } };
}

/**
 * Every response, errors included, is JSON.
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
 * @param {Library} library
 * @param {Day} today
 * @returns {http.Server}
 */
export function createServer(library, today) {
    return http.createServer(async (request, response) => {
        sendJson(response, await route(library, today, request));
    });
}
