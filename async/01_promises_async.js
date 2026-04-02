// ============================================================
// Async JavaScript: Callbacks, Promises, async/await, Fetch
// ============================================================

// ------------------------------------------------------------
// Callbacks: the original async pattern
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
// Promises: cleaner async handling
// ------------------------------------------------------------

console.log("\n=== Promises ===");

const myPromise = new Promise((resolve, reject) => {
    const success = true;

    if (success) {
        resolve("Success!"); // The promise is fulfilled
    } else {
        reject("Error occurred!"); // The promise is rejected
    }
});

myPromise
    .then(result => console.log(result))   // "Success!" if resolved
    .catch(error => console.log(error));   // "Error occurred!" if rejected

// Returning a Promise from a function
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

// Chaining: each .then() returns a new Promise
fetchUserPromise(2)
    .then(user => user.name.toUpperCase())
    .then(name => console.log("Chained:", name))
    .catch(err => console.log("Error:", err.message));

// ------------------------------------------------------------
// Fetch API: Promises in practice
// ------------------------------------------------------------

// fetch() returns a Promise. This is the standard way to make
// HTTP requests in browsers and Node 18+.

// fetch('https://jsonplaceholder.typicode.com/todos/1')
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch(error => console.log('Error:', error));

// ------------------------------------------------------------
// async/await: syntactic sugar over Promises
// ------------------------------------------------------------

console.log("\n=== async/await ===");

// Async awaits can handle requests more effectively
async function fetchData() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log("Error:", error);
    }
}

// fetchData(); // Uncomment to run (requires Node 18+ or browser)

// Same pattern with our local Promise function
async function getUser(id) {
    try {
        const user = await fetchUserPromise(id);
        console.log("Async result:", user);
        return user;
    } catch (error) {
        console.log("Async error:", error.message);
    }
}

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
// Promise.all: run multiple promises in parallel
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

// Real-world example with fetch:
// const fetchPost = fetch('https://jsonplaceholder.typicode.com/posts/1');
// const fetchUser = fetch('https://jsonplaceholder.typicode.com/users/1');
//
// Promise.all([fetchPost, fetchUser])
//     .then(responses => Promise.all(responses.map(res => res.json())))
//     .then(data => {
//         const [post, user] = data;
//         console.log('Post:', post);
//         console.log('User:', user);
//     })
//     .catch(error => console.log('Error:', error));

// Promise.allSettled: like all, but doesn't short-circuit on failure
// Promise.race: resolves/rejects with the first settled promise
// Promise.any: resolves with the first fulfilled promise

// ------------------------------------------------------------
// Axios: a popular HTTP client (npm i axios)
// ------------------------------------------------------------

// Axios streamlines the process. It handles JSON parsing
// automatically and has a cleaner error handling API.

// const axios = require("axios");
//
// axios.get("https://pokeapi.co/api/v2/pokemon")
//     .then(response => {
//         console.log("Data received:");
//         const data = response.data.results;
//         data.forEach(pokemon => {
//             console.log(pokemon.name);
//         });
//     })
//     .catch(error => {
//         console.error("Error fetching data:", error);
//     });

// ------------------------------------------------------------
// Key Rules
// ------------------------------------------------------------

// 1. async functions always return a Promise
// 2. await can only be used inside async functions (or top-level in modules)
// 3. Use try/catch for error handling with await
// 4. Use Promise.all for parallel operations
// 5. Never mix callbacks and promises in the same flow
