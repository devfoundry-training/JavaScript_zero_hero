// ============================================================
// Iteration — for, while, for...of, for...in
// ============================================================

// ------------------------------------------------------------
// for loop — counted iteration
// ------------------------------------------------------------

console.log("=== for loop ===");
for (let i = 0; i < 5; i++) {
    console.log(`i = ${i}`);
}

// ------------------------------------------------------------
// while — condition-based
// ------------------------------------------------------------

console.log("\n=== while ===");
let countdown = 3;
while (countdown > 0) {
    console.log(`T-minus ${countdown}`);
    countdown--;
}

// ------------------------------------------------------------
// do...while — runs at least once
// ------------------------------------------------------------

console.log("\n=== do...while ===");
let x = 10;
do {
    console.log(`x = ${x}`);
    x++;
} while (x < 5); // false immediately, but body ran once

// ------------------------------------------------------------
// for...of — iterate over values (arrays, strings, Maps, Sets)
// ------------------------------------------------------------

console.log("\n=== for...of ===");
const fruits = ["Apple", "Banana", "Cherry"];
for (const fruit of fruits) {
    console.log(fruit);
}

// Works on strings too
for (const char of "Hello") {
    process.stdout.write(char + " ");
}
console.log();

// ------------------------------------------------------------
// for...in — iterate over keys/indices (objects)
// ------------------------------------------------------------

console.log("\n=== for...in ===");
const person = { name: "Alice", age: 30, city: "London" };
for (const key in person) {
    console.log(`${key}: ${person[key]}`);
}

// for...in on arrays gives string indices — prefer for...of
// for (const idx in fruits) { ... } // "0", "1", "2" as strings

// ------------------------------------------------------------
// break and continue
// ------------------------------------------------------------

console.log("\n=== break / continue ===");
for (let i = 0; i < 10; i++) {
    if (i === 3) continue; // skip 3
    if (i === 7) break;    // stop at 7
    console.log(i);
}

// ------------------------------------------------------------
// Array iteration methods (functional style)
// ------------------------------------------------------------

console.log("\n=== forEach ===");
fruits.forEach((fruit, index) => {
    console.log(`${index}: ${fruit}`);
});

// forEach vs for...of:
//   forEach: no break/continue, callback-based
//   for...of: supports break/continue, cleaner for simple iteration
