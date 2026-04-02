// ============================================================
// Task 03: Async — Promises and async/await
// ============================================================
// Complete each section. Run with: node tasks/03_async_task.js
// ============================================================

// Helper: simulates an async database lookup
function findUser(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = { 1: "Alice", 2: "Bob", 3: "Carol" };
            if (users[id]) {
                resolve({ id, name: users[id] });
            } else {
                reject(new Error(`User ${id} not found`));
            }
        }, 100);
    });
}

// 1. Use .then() and .catch() to call findUser(1) and print
//    the result. Then call findUser(99) and handle the error.


// 2. Rewrite question 1 using async/await with try/catch.


// 3. Write an async function called fetchAll that uses
//    Promise.all to fetch users 1, 2, and 3 simultaneously.
//    Print all three results.


// 4. Write an async function called fetchFirst that uses
//    Promise.race to return whichever user resolves first
//    from ids 1, 2, and 3.


// 5. Create a function called delay(ms) that returns a
//    Promise that resolves after ms milliseconds.
//    Use it to print "Hello" after 500ms using await.


// 6. Write an async function that calls findUser for ids
//    1 through 5. Some will fail. Use Promise.allSettled
//    to get all results, then print which succeeded and
//    which failed.


// 7. Create a simple retry function:
//    async function retry(fn, attempts)
//    It should call fn(), and if it throws, try again up
//    to `attempts` times. If all attempts fail, throw the
//    last error.

