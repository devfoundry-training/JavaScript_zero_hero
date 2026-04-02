// ============================================================
// Functions: Declarations, Arrows, Closures, Higher-Order
// ============================================================

// ------------------------------------------------------------
// Function Declaration vs Expression vs Arrow
// ------------------------------------------------------------

// Variables
let x, y, z;
x = 5;
y = 10;
z = 15;

// Normal function (requires 'function' keyword and 'return')
function normalFunc(i, j) {
    return i + j;
}

// Arrow function (implicit return for single expression)
const arrowFunc = (i, j) => i + j;

// Arrow function without implicit return (needs curly braces)
const arrowFuncNonImplicit = (i, j) => { return i + j; };

let oldResult = normalFunc(1, 2);          // 3
let result = arrowFunc(1, 2);              // 3
let nonRes = arrowFuncNonImplicit(1, 2);   // 3

console.log("=== Function Types ===");
console.log(oldResult, result, nonRes);

// Function expression (NOT hoisted)
const subtract = function(a, b) {
    return a - b;
};

// Single parameter: parentheses optional
const double = n => n * 2;

console.log(subtract(10, 4)); // 6
console.log(double(7));       // 14

// ------------------------------------------------------------
// "this" Binding: Arrow vs Normal
// ------------------------------------------------------------

// Arrow functions inherit "this" from the enclosing scope.
// Normal functions get their own "this" (often not what you want).

console.log("\n=== this Behaviour ===");

// Arrow function: "this" refers to the TimerArrow object
function TimerArrow() {
    this.seconds = 0;
    setInterval(() => {
        this.seconds++;  // 'this' refers to the TimerArrow object
        // console.log(this.seconds);
    }, 1000);
}

// Normal function: "this" does NOT refer to the TimerNormal object
function TimerNormal() {
    this.seconds = 0;
    setInterval(function() {
        this.seconds++;  // 'this' refers to the global object (or undefined in strict mode)
        // console.log(this.seconds);
    }, 1000);
}

// Uncomment the console.log lines above to see the difference.
// TimerArrow counts up correctly; TimerNormal gives NaN.

// ------------------------------------------------------------
// Arguments: rest params vs arguments object
// ------------------------------------------------------------

console.log("\n=== Arguments ===");

// Arrow functions do NOT have an 'arguments' object. Use rest params.
const arrowFuncWithRest = (...args) => args.reduce((sum, num) => sum + num, 0);

// Normal functions have the 'arguments' object
const normalFuncWithArguments = function() {
    return Array.from(arguments).reduce((sum, num) => sum + num, 0);
};

console.log(arrowFuncWithRest(1, 2, 3));        // 6
console.log(normalFuncWithArguments(1, 2, 3));   // 6

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
// Higher-Order Functions: functions that take/return functions
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
// Closures: inner function captures outer scope
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

// The count variable is private, only accessible via the returned methods.
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
// Working with Function Arguments via Spread
// ------------------------------------------------------------

console.log("\n=== Spread with Functions ===");

function add(a, b, c) {
    return a + b + c;
}

const numbersToSum = [1, 2, 3];
console.log("Sum of numbers:", add(...numbersToSum)); // 6

// Rest params collect; spread expands. They look the same (...) but
// rest is used in function definitions, spread is used at call sites.

// ------------------------------------------------------------
// IIFE: Immediately Invoked Function Expression
// ------------------------------------------------------------

console.log("\n=== IIFE ===");

(function() {
    const secret = "hidden";
    console.log("IIFE ran, secret:", secret);
})();

// secret is not accessible here. IIFE creates its own scope.
// Common pattern for module encapsulation before ES modules existed.
