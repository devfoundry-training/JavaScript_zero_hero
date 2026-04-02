// ============================================================
// Collections: Arrays, Objects, Map, Set
// ============================================================

// ------------------------------------------------------------
// Arrays: ordered, indexed, resizable
// ------------------------------------------------------------

console.log("=== Arrays ===");

const nums = [10, 20, 30, 40, 50];
console.log("Length:", nums.length);
console.log("First:", nums[0]);
console.log("Last:", nums[nums.length - 1]);

// Mutating methods
nums.push(60);          // add to end
nums.unshift(0);        // add to start
nums.pop();             // remove from end
nums.shift();           // remove from start
nums.splice(1, 1);      // remove 1 element at index 1
console.log("After mutations:", nums);

// Non-mutating methods (return new arrays)
const doubled = nums.map(n => n * 2);
const evens = nums.filter(n => n % 2 === 0);
const sum = nums.reduce((acc, n) => acc + n, 0);
const found = nums.find(n => n > 25);
const hasLarge = nums.some(n => n > 100);
const allPositive = nums.every(n => n > 0);

console.log("map (doubled):", doubled);
console.log("filter (evens):", evens);
console.log("reduce (sum):", sum);
console.log("find (> 25):", found);
console.log("some (> 100):", hasLarge);
console.log("every (> 0):", allPositive);

// Sorting
const names = ["Charlie", "Alice", "Bob"];
console.log("Sorted:", [...names].sort());
console.log("Numeric sort:", [3, 1, 10, 2].sort((a, b) => a - b));

// ------------------------------------------------------------
// Spread with Arrays
// ------------------------------------------------------------

console.log("\n=== Spread with Arrays ===");

// Shallow copy
const numbers = [1, 2, 3];
const copy = [...numbers];
console.log("Original:", numbers);
console.log("Copy:", copy);

// Merging
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const merged = [...arr1, ...arr2];
console.log("Merged:", merged); // [1, 2, 3, 4, 5, 6]

// Adding elements in between
const fruits = ["apple", "banana", "cherry"];
const moreFruits = ["kiwi", "mango"];
const combinedFruits = ["orange", ...fruits, ...moreFruits, "grape"];
console.log("Combined fruits:", combinedFruits);

// Remove duplicates with Set
const dupes = [1, 1, 2, 3, 3, 4];
const unique = [...new Set(dupes)];
console.log("Unique:", unique);

// ------------------------------------------------------------
// Objects: key-value pairs
// ------------------------------------------------------------

console.log("\n=== Objects ===");

const person = {
    name: "Alice",
    age: 30,
    city: "London",
    greet() {
        return `Hi, I'm ${this.name}`;
    }
};

console.log(person.name);           // dot notation
console.log(person["city"]);        // bracket notation
console.log(person.greet());

// Add / modify / delete properties
person.email = "alice@mail.com";
person.age = 31;
delete person.city;

console.log("Keys:", Object.keys(person));
console.log("Values:", Object.values(person));
console.log("Entries:", Object.entries(person));

// Check if key exists
console.log("Has name:", "name" in person);

// ------------------------------------------------------------
// Spread with Objects
// ------------------------------------------------------------

console.log("\n=== Spread with Objects ===");

// Shallow copy
const alice = { name: "Alice", age: 25 };
const copiedPerson = { ...alice };
console.log("Copied person:", copiedPerson);

// Merging
const obj1 = { name: "Alice", age: 25 };
const obj2 = { city: "New York", occupation: "Developer" };
const mergedObj = { ...obj1, ...obj2 };
console.log("Merged object:", mergedObj);

// Overriding properties
const updatedPerson = { name: "Bob", city: "New York" };
const mergedPerson = { ...alice, ...updatedPerson };
console.log("Override:", mergedPerson);
// name is overridden by updatedPerson

// Avoiding mutation
const modifiedObj = { ...alice, b: 3 };
console.log("Original:", alice);        // unchanged
console.log("Modified:", modifiedObj);

// Shallow copy warning with nested objects
const nestedArray = [{ name: "Alice" }, { name: "Bob" }];
const copiedArray = [...nestedArray];
nestedArray[0].name = "Charlie";
console.log("Nested original:", nestedArray);
console.log("Nested copy:", copiedArray);
// Both changed because it's a shallow copy (same reference)

// Deep copy with JSON
const original = { a: 1, b: { c: 2 } };
const deepCopy = JSON.parse(JSON.stringify(original));
original.b.c = 3;
console.log("Deep copy:", deepCopy.b.c); // 2 (unaffected)

// ------------------------------------------------------------
// Map: key-value with any key type
// ------------------------------------------------------------

console.log("\n=== Map ===");

const map = new Map();
map.set("name", "Bob");
map.set(42, "the answer");
map.set(true, "yes");

console.log("Get 42:", map.get(42));
console.log("Size:", map.size);
console.log("Has true:", map.has(true));

for (const [key, value] of map) {
    console.log(`  ${key} => ${value}`);
}

// Cloning a Map with spread
const map1 = new Map([["a", 1], ["b", 2]]);
const map2 = new Map([...map1]);
console.log("Cloned map:", map2);

// ------------------------------------------------------------
// Set: unique values only
// ------------------------------------------------------------

console.log("\n=== Set ===");

const set = new Set([1, 2, 3, 2, 1]);
console.log("Set:", set);       // {1, 2, 3}
console.log("Size:", set.size); // 3

set.add(4);
set.delete(1);
console.log("Has 2:", set.has(2));

// Spread with Set
const setToArray = [...set];
console.log("Set to array:", setToArray);

// Cloning a Set
const set1 = new Set([1, 2, 3]);
const set2 = new Set([...set1]);
console.log("Cloned set:", set2);

// ------------------------------------------------------------
// Working with Function Arguments via Spread
// ------------------------------------------------------------

console.log("\n=== Spread with Functions ===");

function total(...args) {
    return args.reduce((sum, current) => sum + current, 0);
}

const numbersToSum = [1, 2, 3, 4];
console.log("Sum of numbers:", total(...numbersToSum)); // 10
