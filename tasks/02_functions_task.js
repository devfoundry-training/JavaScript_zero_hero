// ============================================================
// Task 02: Functions, Closures, Higher-Order
// ============================================================
// Complete each section. Run with: node tasks/02_functions_task.js
// ============================================================

// 1. Write a function called greet that takes a name parameter
//    with a default value of "World" and returns "Hello, {name}!"


// 2. Rewrite greet as an arrow function called greetArrow.


// 3. Write a function called sum that accepts any number of
//    arguments using rest parameters and returns their total.
//    Example: sum(1, 2, 3, 4) => 10


// 4. Write a higher-order function called repeat that takes
//    a function and a number n, and calls the function n times.
//    Example: repeat(() => console.log("hi"), 3) prints "hi" 3 times


// 5. Write a function called createCounter that returns an
//    object with increment(), decrement(), and value() methods.
//    The count should be private (not directly accessible).
//    This is the closure pattern.
//    Example:
//      const c = createCounter();
//      c.increment(); c.increment(); c.decrement();
//      console.log(c.value()); // 1


// 6. Write a function called multiplyBy that takes a factor
//    and returns a new function that multiplies its argument
//    by that factor. (Factory pattern)
//    Example:
//      const double = multiplyBy(2);
//      console.log(double(5)); // 10


// 7. Given this array of numbers, use map, filter, and reduce
//    to: (a) double each number, (b) keep only values > 10,
//    (c) sum the remaining values.
const numbers = [1, 3, 5, 7, 9, 11];


// 8. Write a function called once that takes a function and
//    returns a version that can only be called once. Subsequent
//    calls return the first result without re-executing.
//    Example:
//      const initialize = once(() => { console.log("init"); return 42; });
//      initialize(); // prints "init", returns 42
//      initialize(); // returns 42, no print

