// ============================================================
// Variables, Data Types, and Type Coercion
// ============================================================
// JavaScript's type system, variable declarations, and the
// difference between let, const, and var.
// ============================================================

// ------------------------------------------------------------
// Variable Declarations: let, const, var
// ------------------------------------------------------------

// let: block-scoped, reassignable
let x = 10;
console.log("Initial x value:", x); // 10
x = 20;
console.log("Reassigned x value:", x); // 20

// const: block-scoped, cannot be reassigned
const z = 50;
console.log("z value:", z); // 50
// z = 60; // TypeError: Assignment to constant variable

// var: function-scoped, hoisted. Avoid in modern JS.
var y = 30;
y = 40;
console.log("Reassigned y value:", y); // 40

// Rule: use const by default. Use let when you need to reassign.
// Never use var in new code.

// ------------------------------------------------------------
// Block Scoping vs Function Scoping
// ------------------------------------------------------------

// let is block-scoped
if (true) {
    let blockVar = "I'm inside a block!";
    console.log(blockVar); // "I'm inside a block!"
}
// console.log(blockVar); // ReferenceError: blockVar is not defined

// var is function-scoped (leaks out of blocks)
if (true) {
    var functionVar = "I'm inside a block, but var makes me function-scoped!";
    console.log(functionVar);
}
console.log(functionVar); // Still accessible outside the block

// ------------------------------------------------------------
// Primitive Types
// ------------------------------------------------------------

// String
let name = "John";
console.log("Name:", name);

// Number (integer and float are the same type)
let age = 30;
console.log("Age:", age);

// Boolean
let isAdult = true;
console.log("Is adult:", isAdult);

// Undefined (not yet assigned)
let something;
console.log("Something:", something); // undefined

// Null (intentional absence)
let object = null;
console.log("Object:", object); // null

// Symbol (unique identifier)
let uniqueSymbol = Symbol("id");
console.log("Unique Symbol:", uniqueSymbol); // Symbol(id)

// BigInt (arbitrary precision)
const big = 9007199254740991n;

// typeof checks
console.log("\n=== typeof Results ===");
console.log(typeof name);      // "string"
console.log(typeof age);       // "number"
console.log(typeof isAdult);   // "boolean"
console.log(typeof something); // "undefined"
console.log(typeof object);    // "object" (known JS quirk)
console.log(typeof uniqueSymbol); // "symbol"
console.log(typeof big);       // "bigint"

// ------------------------------------------------------------
// Non-Primitive Types
// ------------------------------------------------------------

// Object
let person = {
    firstName: "Jane",
    lastName: "Doe",
    age: 28
};
console.log("Person Object:", person);

// Array
let fruits = ["apple", "banana", "cherry"];
console.log("Fruits Array:", fruits);

// Function
function greet() {
    console.log("Hello, world!");
}
greet();

// ------------------------------------------------------------
// Strings: Template Literals
// ------------------------------------------------------------

const userName = "Alice";
const userAge = 30;

// Concatenation (old way)
console.log("Name: " + userName + ", Age: " + userAge);

// Template literal (preferred, uses backticks)
console.log(`Name: ${userName}, Age: ${userAge}`);
console.log(`Next year: ${userAge + 1}`);

// Multi-line strings
const multiLine = `
  This is line one.
  This is line two.
`;

// Common string methods
console.log("\n=== String Methods ===");
console.log("hello".toUpperCase());           // "HELLO"
console.log("Hello World".includes("World")); // true
console.log("Hello".padStart(10, "-"));       // "-----Hello"
console.log("  spaces  ".trim());             // "spaces"
console.log("a,b,c".split(","));             // ["a", "b", "c"]

// ------------------------------------------------------------
// Type Coercion: Implicit Conversion
// ------------------------------------------------------------

console.log("\n=== Type Coercion ===");

// == (loose equality) performs type coercion
console.log(5 == "5");    // true (string coerced to number)
console.log(0 == false);  // true (false coerced to 0)

// === (strict equality) does NOT coerce. Always use this.
console.log(5 === "5");   // false (different types)
console.log(0 === false); // false

// String + number = string concatenation
console.log("5" + 3);     // "53" (number converted to string)

// Other operators = numeric conversion
console.log("5" - 3);     // 2 (string converted to number)
console.log("5" * 2);     // 10

// Rule: always use === and !== to avoid coercion bugs.

// ------------------------------------------------------------
// Truthy and Falsy Values
// ------------------------------------------------------------

console.log("\n=== Falsy Values ===");
// These are ALL the falsy values in JS:
// false, 0, -0, 0n, "", null, undefined, NaN

if (!"") console.log("Empty string is falsy");
if (!0)  console.log("Zero is falsy");
if (!null) console.log("null is falsy");

// Everything else is truthy, including:
// "0", " ", [], {}, -1
if ("0")  console.log('"0" is truthy (non-empty string)');
if ([])   console.log("[] is truthy (empty array)");
