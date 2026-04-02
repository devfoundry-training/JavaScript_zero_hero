// ============================================================
// Collections — Arrays and Objects
// ============================================================

// ------------------------------------------------------------
// Arrays — ordered, indexed, resizable
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

// Spread to copy
const copy = [...nums];

// ------------------------------------------------------------
// Objects — key-value pairs
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

// Spread to copy/merge
const updated = { ...person, role: "trainer" };
console.log("Merged:", updated);

// ------------------------------------------------------------
// Map — key-value with any key type
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

// ------------------------------------------------------------
// Set — unique values only
// ------------------------------------------------------------

console.log("\n=== Set ===");

const set = new Set([1, 2, 3, 2, 1]);
console.log("Set:", set);       // {1, 2, 3}
console.log("Size:", set.size); // 3

set.add(4);
set.delete(1);
console.log("Has 2:", set.has(2));

// Remove duplicates from an array
const dupes = [1, 1, 2, 3, 3, 4];
const unique = [...new Set(dupes)];
console.log("Unique:", unique);
