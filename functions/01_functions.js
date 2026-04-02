// ============================================================
// Functions — Declarations, Arrows, Closures, Higher-Order
// ============================================================

// ------------------------------------------------------------
// Function Declaration vs Expression
// ------------------------------------------------------------

// Declaration — hoisted (available before its line in code)
function add(a, b) {
    return a + b;
}

// Expression — NOT hoisted
const subtract = function(a, b) {
    return a - b;
};

// Arrow function — concise syntax, no own `this`
const multiply = (a, b) => a * b;

// Single parameter — parentheses optional
const double = n => n * 2;

console.log("=== Basics ===");
console.log(add(3, 5));       // 8
console.log(subtract(10, 4)); // 6
console.log(multiply(3, 4));  // 12
console.log(double(7));       // 14

// ------------------------------------------------------------
// Default Parameters
// ------------------------------------------------------------

function greet(name = "World") {
    return `Hello, ${name}!`;
}

console.log("\n=== Defaults ===");
console.log(greet());         // "Hello, World!"
console.log(greet("Alice"));  // "Hello, Alice!"

// ------------------------------------------------------------
// Rest Parameters
// ------------------------------------------------------------

function sum(...numbers) {
    return numbers.reduce((acc, n) => acc + n, 0);
}

console.log("\n=== Rest ===");
console.log(sum(1, 2, 3, 4)); // 10

// ------------------------------------------------------------
// Higher-Order Functions — functions that take/return functions
// ------------------------------------------------------------

console.log("\n=== Higher-Order ===");

function applyTwice(fn, value) {
    return fn(fn(value));
}
console.log(applyTwice(double, 3)); // 12

// Returning a function (factory pattern)
function multiplier(factor) {
    return (n) => n * factor;
}
const triple = multiplier(3);
console.log(triple(10)); // 30

// ------------------------------------------------------------
// Closures — inner function captures outer scope
// ------------------------------------------------------------

console.log("\n=== Closures ===");

function counter() {
    let count = 0;
    return {
        increment: () => ++count,
        decrement: () => --count,
        value: () => count,
    };
}

const c = counter();
c.increment();
c.increment();
c.decrement();
console.log("Counter:", c.value()); // 1

// The count variable is private — only accessible via the returned methods.
// This is the closure pattern for encapsulation in JS.

// ------------------------------------------------------------
// Callback Pattern
// ------------------------------------------------------------

console.log("\n=== Callbacks ===");

function fetchData(callback) {
    // Simulate async work
    const data = { name: "Alice", age: 30 };
    callback(data);
}

fetchData((result) => {
    console.log("Received:", result);
});

// Callbacks are the foundation of async JS.
// Promises and async/await (see async/) replaced deeply nested callbacks.

// ------------------------------------------------------------
// IIFE — Immediately Invoked Function Expression
// ------------------------------------------------------------

console.log("\n=== IIFE ===");

(function() {
    const secret = "hidden";
    console.log("IIFE ran, secret:", secret);
})();

// secret is not accessible here — IIFE creates its own scope.
// Common pattern for module encapsulation before ES modules existed.
