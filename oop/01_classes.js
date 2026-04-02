// ============================================================
// OOP: Classes, Inheritance, Encapsulation
// ============================================================

// ------------------------------------------------------------
// Class Basics
// ------------------------------------------------------------

class Vehicle {
    constructor(make, model, year) {
        this.make = make;
        this.model = model;
        this.year = year;
    }

    describe() {
        return `${this.year} ${this.make} ${this.model}`;
    }

    toString() {
        return this.describe();
    }
}

const car = new Vehicle("Toyota", "Corolla", 2022);
console.log("=== Classes ===");
console.log(car.describe());

// ------------------------------------------------------------
// Inheritance: extends and super
// ------------------------------------------------------------

class ElectricVehicle extends Vehicle {
    constructor(make, model, year, range) {
        super(make, model, year); // call parent constructor
        this.range = range;
    }

    // Override parent method
    describe() {
        return `${super.describe()} (EV, ${this.range}mi range)`;
    }
}

const ev = new ElectricVehicle("Tesla", "Model 3", 2024, 350);
console.log("\n=== Inheritance ===");
console.log(ev.describe());
console.log("Is Vehicle:", ev instanceof Vehicle);       // true
console.log("Is EV:", ev instanceof ElectricVehicle);     // true

// ------------------------------------------------------------
// Private Fields (#)
// ------------------------------------------------------------

class BankAccount {
    #balance; // truly private, not accessible outside the class

    constructor(owner, initial = 0) {
        this.owner = owner;
        this.#balance = initial;
    }

    deposit(amount) {
        if (amount <= 0) throw new Error("Amount must be positive");
        this.#balance += amount;
        return this.#balance;
    }

    withdraw(amount) {
        if (amount > this.#balance) throw new Error("Insufficient funds");
        this.#balance -= amount;
        return this.#balance;
    }

    get balance() {
        return this.#balance;
    }
}

console.log("\n=== Private Fields ===");
const account = new BankAccount("Alice", 100);
account.deposit(50);
console.log("Balance:", account.balance); // 150
// account.#balance = 999; // SyntaxError: truly private

// ------------------------------------------------------------
// Static Methods and Properties
// ------------------------------------------------------------

class MathUtils {
    static PI = 3.14159;

    static circleArea(radius) {
        return MathUtils.PI * radius ** 2;
    }
}

console.log("\n=== Static ===");
console.log("PI:", MathUtils.PI);
console.log("Area (r=5):", MathUtils.circleArea(5));
// Static members belong to the class, not instances.

// ------------------------------------------------------------
// Getters and Setters
// ------------------------------------------------------------

class Temperature {
    #celsius;

    constructor(celsius) {
        this.#celsius = celsius;
    }

    get fahrenheit() {
        return (this.#celsius * 9/5) + 32;
    }

    set fahrenheit(f) {
        this.#celsius = (f - 32) * 5/9;
    }

    get celsius() {
        return this.#celsius;
    }
}

console.log("\n=== Getters/Setters ===");
const temp = new Temperature(100);
console.log("Celsius:", temp.celsius);       // 100
console.log("Fahrenheit:", temp.fahrenheit); // 212
temp.fahrenheit = 32;
console.log("After set 32F:", temp.celsius); // 0

// ------------------------------------------------------------
// Polymorphism
// ------------------------------------------------------------

console.log("\n=== Polymorphism ===");

class Shape {
    area() { throw new Error("Subclass must implement area()"); }
}

class Circle extends Shape {
    constructor(radius) { super(); this.radius = radius; }
    area() { return Math.PI * this.radius ** 2; }
}

class Rectangle extends Shape {
    constructor(w, h) { super(); this.w = w; this.h = h; }
    area() { return this.w * this.h; }
}

const shapes = [new Circle(5), new Rectangle(4, 3), new Circle(2)];
for (const s of shapes) {
    console.log(`${s.constructor.name}: area = ${s.area().toFixed(2)}`);
}
