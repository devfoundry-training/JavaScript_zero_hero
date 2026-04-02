// ============================================================
// Operators — Arithmetic, Comparison, Logical, Nullish
// ============================================================

// ------------------------------------------------------------
// Arithmetic
// ------------------------------------------------------------

console.log("=== Arithmetic ===");
console.log(10 + 3);   // 13
console.log(10 - 3);   // 7
console.log(10 * 3);   // 30
console.log(10 / 3);   // 3.333...
console.log(10 % 3);   // 1 (remainder)
console.log(2 ** 8);   // 256 (exponent)

// Increment / decrement
let x = 5;
console.log(x++);  // 5 (returns then increments)
console.log(x);    // 6
console.log(++x);  // 7 (increments then returns)

// ------------------------------------------------------------
// Comparison — always use strict equality
// ------------------------------------------------------------

console.log("\n=== Comparison ===");
console.log(5 === 5);    // true
console.log(5 !== "5");  // true (different types)
console.log(10 > 5);     // true
console.log(10 >= 10);   // true

// ------------------------------------------------------------
// Logical Operators
// ------------------------------------------------------------

console.log("\n=== Logical ===");
console.log(true && false);  // false (AND)
console.log(true || false);  // true  (OR)
console.log(!true);          // false (NOT)

// Short-circuit evaluation
const user = null;
const displayName = user && user.name; // null (doesn't access .name)
const fallback = user || "Anonymous";  // "Anonymous"
console.log(displayName, fallback);

// ------------------------------------------------------------
// Nullish Coalescing (??) — ES2020
// ------------------------------------------------------------

// ?? returns the right side ONLY if left is null or undefined
// || returns the right side if left is ANY falsy value

const score = 0;
console.log("\n=== Nullish Coalescing ===");
console.log(score || 100);  // 100 (0 is falsy)
console.log(score ?? 100);  // 0   (0 is not null/undefined)

// ------------------------------------------------------------
// Optional Chaining (?.) — ES2020
// ------------------------------------------------------------

const config = { db: { host: "localhost" } };
console.log(config.db?.host);     // "localhost"
console.log(config.db?.port);     // undefined (no error)
console.log(config.cache?.host);  // undefined (no error)
// Without ?., config.cache.host would throw TypeError

// ------------------------------------------------------------
// Ternary Operator
// ------------------------------------------------------------

const temp = 25;
const weather = temp > 20 ? "Warm" : "Cold";
console.log(`\nWeather: ${weather}`);

// ------------------------------------------------------------
// Destructuring Assignment
// ------------------------------------------------------------

console.log("\n=== Destructuring ===");

// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first, second, rest); // 1 2 [3, 4, 5]

// Object destructuring
const person = { name: "Bob", age: 25, city: "London" };
const { name: personName, age: personAge } = person;
console.log(personName, personAge); // "Bob" 25

// Default values
const { role = "user" } = person;
console.log(role); // "user" (not in object, uses default)

// ------------------------------------------------------------
// Spread Operator
// ------------------------------------------------------------

console.log("\n=== Spread ===");

// Copy an array
const nums = [1, 2, 3];
const copied = [...nums, 4, 5];
console.log(copied); // [1, 2, 3, 4, 5]

// Merge objects
const defaults = { theme: "dark", lang: "en" };
const userPrefs = { lang: "fr" };
const merged = { ...defaults, ...userPrefs };
console.log(merged); // { theme: "dark", lang: "fr" }
