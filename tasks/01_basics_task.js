// ============================================================
// Task 01: Variables, Types, and Operators
// ============================================================
// Complete each section. Run with: node tasks/01_basics_task.js
// ============================================================

// 1. Declare a constant called PI with the value 3.14159.
//    Declare a variable called radius using let, set to 10.
//    Calculate and print the area of a circle (PI * r * r).


// 2. Create three variables: name (string), age (number),
//    isStudent (boolean). Print them using a template literal
//    in the format: "Name is age years old, student: true/false"


// 3. What does each of these evaluate to? Predict first, then
//    uncomment to check:
// console.log(typeof null);
// console.log("5" + 3);
// console.log("5" - 3);
// console.log(0 == false);
// console.log(0 === false);
// console.log("" == false);
// console.log("" === false);


// 4. Given this object, use destructuring to extract name and
//    city into separate variables. Print both.
const person = { name: "Alice", age: 30, city: "London", role: "trainer" };


// 5. Given these two arrays, use the spread operator to create
//    a new array containing all elements from both.
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];


// 6. Write a ternary expression that sets a variable called
//    access to "granted" if age >= 18, otherwise "denied".
//    Use the age variable from question 2.


// 7. Given this object, use optional chaining to safely access
//    config.database.port. What does it return?
const config = { server: { host: "localhost" } };


// 8. Use nullish coalescing (??) to set a default value.
//    Given: const score = 0;
//    Set displayScore to score if it's not null/undefined,
//    otherwise 100. What's the difference from using ||?


// 9. Create a shallow copy of this object using spread.
//    Then modify the copy and verify the original is unchanged.
const original = { name: "Bob", age: 25, city: "New York" };


// 10. Given this nested object, demonstrate why a shallow copy
//     shares nested references. Then show a deep copy using JSON.
const nested = { a: 1, b: { c: 2 } };
