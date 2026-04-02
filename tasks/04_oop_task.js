// ============================================================
// Task 04: OOP — Classes, Inheritance, Encapsulation
// ============================================================
// Complete each section. Run with: node tasks/04_oop_task.js
// ============================================================

// 1. Create a class called Animal with:
//    - constructor(name, sound)
//    - a speak() method that prints "{name} says {sound}!"
//    Create two instances and call speak() on each.


// 2. Create a class called Dog that extends Animal.
//    - constructor(name, breed) — call super with sound "Woof"
//    - add a fetch() method that prints "{name} fetches the ball!"
//    Create an instance, call speak() and fetch().


// 3. Create a class called BankAccount with:
//    - a private field #balance (set via constructor)
//    - deposit(amount) — adds to balance, returns new balance
//    - withdraw(amount) — subtracts if sufficient funds, throws Error if not
//    - a getter for balance
//    Demonstrate that #balance cannot be accessed directly.


// 4. Create a class called Shape with an area() method that
//    throws "Not implemented". Then create:
//    - Circle(radius) with area() returning PI * r^2
//    - Rectangle(width, height) with area() returning w * h
//    - Triangle(base, height) with area() returning 0.5 * b * h
//    Put all three in an array and loop through, printing
//    the constructor name and area for each.


// 5. Add a static method to Shape called compare(a, b) that
//    returns the shape with the larger area.
//    Test it with a Circle(5) and Rectangle(8, 4).


// 6. Create a class called Stack that uses a private array
//    to implement:
//    - push(item)
//    - pop() — throws if empty
//    - peek() — returns top without removing
//    - get size
//    - isEmpty()

