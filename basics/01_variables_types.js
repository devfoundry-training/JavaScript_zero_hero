// ============================================================
// Variables, Data Types, and Type Coercion
// ============================================================
// JavaScript's type system, variable declarations, and the
// difference between let, const, and var.
// ============================================================

// ------------------------------------------------------------
// Variable Declarations — let, const, var
// ------------------------------------------------------------

// let: block-scoped, reassignable
let count = 0;
count = 1; // allowed

// const: block-scoped, cannot be reassigned
const PI = 3.14159;
// PI = 3; // TypeError: Assignment to constant variable

// var: function-scoped, hoisted — avoid in modern JS
var legacy = "old style";

// Rule: use const by default. Use let when you need to reassign.
// Never use var in new code.

// ------------------------------------------------------------
// Primitive Types
// ------------------------------------------------------------

const num = 42;              // number (integer and float are the same type)
const decimal = 3.14;        // number
const text = "Hello";        // string
const flag = true;           // boolean
const empty = null;          // null (intentional absence)
let notSet;                  // undefined (not yet assigned)
const id = Symbol("id");     // symbol (unique identifier)
const big = 9007199254740991n; // bigint (arbitrary precision)

console.log("=== Primitive Types ===");
console.log(typeof num);       // "number"
console.log(typeof text);      // "string"
console.log(typeof flag);      // "boolean"
console.log(typeof empty);     // "object" — this is a known JS quirk
console.log(typeof notSet);    // "undefined"
console.log(typeof id);        // "symbol"
console.log(typeof big);       // "bigint"

// ------------------------------------------------------------
// Strings — Template Literals
// ------------------------------------------------------------

const name = "Alice";
const age = 30;

// Concatenation (old way)
console.log("Name: " + name + ", Age: " + age);

// Template literal (preferred — backticks)
console.log(`Name: ${name}, Age: ${age}`);
console.log(`Next year: ${age + 1}`);

// Multi-line strings
const multiLine = `
  This is line one.
  This is line two.
`;

// Common string methods
console.log("\n=== String Methods ===");
console.log("hello".toUpperCase());          // "HELLO"
console.log("Hello World".includes("World")); // true
console.log("Hello".padStart(10, "-"));       // "-----Hello"
console.log("  spaces  ".trim());             // "spaces"
console.log("a,b,c".split(","));              // ["a", "b", "c"]

// ------------------------------------------------------------
// Type Coercion — Implicit Conversion
// ------------------------------------------------------------

console.log("\n=== Type Coercion ===");

// == (loose equality) performs type coercion
console.log(5 == "5");    // true — string coerced to number
console.log(0 == false);  // true — false coerced to 0

// === (strict equality) does NOT coerce — always use this
console.log(5 === "5");   // false — different types
console.log(0 === false); // false

// String + number → string concatenation
console.log("5" + 3);     // "53" (number converted to string)

// Other operators → numeric conversion
console.log("5" - 3);     // 2 (string converted to number)
console.log("5" * 2);     // 10

// Rule: always use === and !== to avoid coercion bugs.

// ------------------------------------------------------------
// Truthy and Falsy Values
// ------------------------------------------------------------

console.log("\n=== Falsy Values ===");
// These are ALL the falsy values in JS:
// false, 0, -0, 0n, "", null, undefined, NaN

if (!"") console.log('Empty string is falsy');
if (!0)  console.log('Zero is falsy');
if (!null) console.log('null is falsy');

// Everything else is truthy, including:
// "0", " ", [], {}, -1
if ("0")  console.log('"0" is truthy (non-empty string)');
if ([])   console.log('[] is truthy (empty array)');
