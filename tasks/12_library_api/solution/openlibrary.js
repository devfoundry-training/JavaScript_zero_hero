// @ts-check
// ============================================================
// Task 12 Stretch: consuming a public API, Open Library search
// ============================================================
// https://openlibrary.org/search.json?title=dune
// Two halves, kept apart on purpose:
//   * summarise() turns response TEXT into lines. No network, so
//     it is checked against the recorded data/openlibrary_dune.json
//   * search() does the HTTP call. It needs the network, so it is
//     never part of a check
// ============================================================

const SEARCH_URL = "https://openlibrary.org/search.json";
const FIELDS = "key,title,author_name,first_publish_year,edition_count,number_of_pages_median";

/**
 * Return the raw JSON text. Throws when the network or Open
 * Library lets us down, or after 10 seconds without an answer.
 * @param {string} title
 * @param {number} [limit]
 * @returns {Promise<string>}
 */
export async function search(title, limit = 3) {
    const query = new URLSearchParams({ title, limit: String(limit), fields: FIELDS });
    const response = await fetch(`${SEARCH_URL}?${query}`, {
        headers: { "User-Agent": "ZeroToHeroLibrary/1.0 (teaching example)" },
        signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
        throw new Error(`Open Library answered ${response.status}`);
    }
    return response.text();
}

/**
 * @typedef {object} OpenLibraryMatch
 * @property {string | null} key
 * @property {string | null} title
 * @property {string[]} authors
 * @property {number | null} first_publish_year
 * @property {number | null} edition_count
 */

/**
 * The first result as a small object for the API, or null.
 * @param {string} text
 * @returns {OpenLibraryMatch | null}
 */
export function firstMatch(text) {
    const docs = JSON.parse(text).docs ?? [];
    if (docs.length === 0) {
        return null;
    }
    const doc = docs[0];
    return {
        key: doc.key ?? null,
        title: doc.title ?? null,
        authors: doc.author_name ?? [],
        first_publish_year: doc.first_publish_year ?? null,
        edition_count: doc.edition_count ?? null,
    };
}

/**
 * Lines describing a search response. Any field can be missing
 * from a real response, so every read has a fallback (??).
 * @param {string} text
 * @returns {string[]}
 */
export function summarise(text) {
    const document = JSON.parse(text);
    const lines = [`Open Library search: ${document.numFound ?? 0} results`];
    (document.docs ?? []).forEach((/** @type {any} */ doc, /** @type {number} */ index) => {
        const authors = (doc.author_name ?? []).join(", ") || "unknown author";
        const year = doc.first_publish_year ?? "unknown";
        const editions = doc.edition_count ?? 0;
        lines.push(`${index + 1}. ${doc.title ?? "untitled"} by ${authors}, first published ${year}, `
            + `${editions} editions, ${doc.key ?? "no key"}`);
    });
    return lines;
}
