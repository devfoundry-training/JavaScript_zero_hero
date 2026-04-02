// ============================================================
// Operators: Arithmetic, Comparison, Logical, Nullish
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
// Comparison: always use strict equality
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
// Nullish Coalescing (??)
// ------------------------------------------------------------

// ?? returns the right side ONLY if left is null or undefined
// || returns the right side if left is ANY falsy value

const score = 0;
console.log("\n=== Nullish Coalescing ===");
console.log(score || 100);  // 100 (0 is falsy)
console.log(score ?? 100);  // 0   (0 is not null/undefined)

// ------------------------------------------------------------
// Optional Chaining (?.)
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

// Shallow copy of an array
const numbers = [1, 2, 3];
const copy = [...numbers];
console.log("Original array:", numbers);
console.log("Copied array:", copy);

// Shallow copy of an object
const alice = { name: "Alice", age: 25 };
const copiedPerson = { ...alice };
console.log("Copied person:", copiedPerson);

// Merging arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const merged = [...arr1, ...arr2];
console.log("Merged array:", merged); // [1, 2, 3, 4, 5, 6]

// Merging objects
const defaults = { theme: "dark", lang: "en" };
const userPrefs = { lang: "fr" };
const mergedPrefs = { ...defaults, ...userPrefs };
console.log("Merged prefs:", mergedPrefs); // { theme: "dark", lang: "fr" }

// Overriding properties in objects
const updatedPerson = { name: "Bob", city: "New York" };
const mergedPerson = { ...alice, ...updatedPerson };
console.log("Merged person with override:", mergedPerson);
// { name: "Bob", age: 25, city: "New York" }
// The 'name' property is overridden by the one from updatedPerson

// Splitting a string into an array
const word = "hello";
const letters = [...word];
console.log("Letters array:", letters); // ['h', 'e', 'l', 'l', 'o']

// Avoiding mutation with objects
const modifiedObj = { ...alice, b: 3 };
console.log("Original object:", alice);     // unchanged
console.log("Modified object:", modifiedObj);

// Shallow copy warning: nested objects are still shared
const nestedArray = [{ name: "Alice" }, { name: "Bob" }];
const copiedArray = [...nestedArray];
nestedArray[0].name = "Charlie";
console.log("Original:", nestedArray);  // [{ name: "Charlie" }, ...]
console.log("Copy:", copiedArray);      // [{ name: "Charlie" }, ...] (same reference)

// Deep copy using JSON methods
const original = { a: 1, b: { c: 2 } };
const deepCopy = JSON.parse(JSON.stringify(original));
original.b.c = 3;
console.log("Deep copy value:", deepCopy.b.c); // 2 (unaffected)
console.log("Original value:", original.b.c);  // 3

// Using spread with Sets and Maps
const mySet = new Set([1, 2, 3]);
const setToArray = [...mySet];
console.log("Set to array:", setToArray); // [1, 2, 3]

const myMap = new Map([["name", "Alice"], ["age", 25]]);
const mapToArray = [...myMap];
console.log("Map to array:", mapToArray);
