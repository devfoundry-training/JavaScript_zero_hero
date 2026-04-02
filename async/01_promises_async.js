// ============================================================
// Async JavaScript — Callbacks, Promises, async/await
// ============================================================

// ------------------------------------------------------------
// Callbacks — the original async pattern
// ------------------------------------------------------------

console.log("=== Callbacks ===");

function fetchUser(id, callback) {
    setTimeout(() => {
        callback({ id, name: "Alice" });
    }, 100);
}

fetchUser(1, (user) => {
    console.log("Callback result:", user);
});

// Problem: nested callbacks become unreadable ("callback hell")

// ------------------------------------------------------------
// Promises — cleaner async handling
// ------------------------------------------------------------

console.log("\n=== Promises ===");

function fetchUserPromise(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id > 0) {
                resolve({ id, name: "Bob" });
            } else {
                reject(new Error("Invalid ID"));
            }
        }, 100);
    });
}

// .then() / .catch() chain
fetchUserPromise(1)
    .then(user => console.log("Promise result:", user))
    .catch(err => console.log("Error:", err.message));

// Chaining — each .then() returns a new Promise
fetchUserPromise(2)
    .then(user => user.name.toUpperCase())
    .then(name => console.log("Chained:", name))
    .catch(err => console.log("Error:", err.message));

// ------------------------------------------------------------
// async / await — syntactic sugar over Promises
// ------------------------------------------------------------

console.log("\n=== async/await ===");

async function getUser(id) {
    try {
        const user = await fetchUserPromise(id);
        console.log("Async result:", user);
        return user;
    } catch (error) {
        console.log("Async error:", error.message);
    }
}

// Call async function
getUser(1);

// Error handling with async/await
async function getUserOrFail() {
    try {
        const user = await fetchUserPromise(-1); // will reject
        console.log(user);
    } catch (error) {
        console.log("Caught async error:", error.message);
    }
}

getUserOrFail();

// ------------------------------------------------------------
// Promise.all — run multiple promises in parallel
// ------------------------------------------------------------

async function fetchAll() {
    const [user1, user2, user3] = await Promise.all([
        fetchUserPromise(1),
        fetchUserPromise(2),
        fetchUserPromise(3),
    ]);
    console.log("\nPromise.all results:", user1, user2, user3);
}

fetchAll();

// Promise.allSettled — like all, but doesn't short-circuit on failure
// Promise.race — resolves/rejects with the first settled promise
// Promise.any — resolves with the first fulfilled promise

// ------------------------------------------------------------
// Fetch API (browser/Node 18+)
// ------------------------------------------------------------

// async function fetchPokemon() {
//     const response = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");
//     if (!response.ok) throw new Error(`HTTP ${response.status}`);
//     const data = await response.json();
//     console.log(data.name, data.height, data.weight);
// }

// Uncomment and run with Node 18+ or in a browser console.

// ------------------------------------------------------------
// Key Rules
// ------------------------------------------------------------

// 1. async functions always return a Promise
// 2. await can only be used inside async functions (or top-level in modules)
// 3. Use try/catch for error handling with await
// 4. Use Promise.all for parallel operations
// 5. Never mix callbacks and promises in the same flow
