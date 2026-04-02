// ============================================================
// Error Handling: try/catch/finally, Custom Errors
// ============================================================

// ------------------------------------------------------------
// try / catch / finally
// ------------------------------------------------------------

console.log("=== try/catch/finally ===");

try {
    const data = JSON.parse('{"valid": true}');
    console.log("Parsed:", data);
} catch (error) {
    console.log("Parse failed:", error.message);
} finally {
    console.log("Always runs");
}

// Catching a specific error
try {
    JSON.parse("not json");
} catch (error) {
    if (error instanceof SyntaxError) {
        console.log("Invalid JSON:", error.message);
    } else {
        throw error; // re-throw unexpected errors
    }
}

// ------------------------------------------------------------
// Throwing Errors
// ------------------------------------------------------------

console.log("\n=== Throwing ===");

function divide(a, b) {
    if (b === 0) throw new Error("Division by zero");
    return a / b;
}

try {
    console.log(divide(10, 2));  // 5
    console.log(divide(10, 0));  // throws
} catch (error) {
    console.log("Caught:", error.message);
}

// ------------------------------------------------------------
// Custom Error Classes
// ------------------------------------------------------------

console.log("\n=== Custom Errors ===");

class ValidationError extends Error {
    constructor(field, message) {
        super(message);
        this.name = "ValidationError";
        this.field = field;
    }
}

class NotFoundError extends Error {
    constructor(resource, id) {
        super(`${resource} with id ${id} not found`);
        this.name = "NotFoundError";
        this.resource = resource;
        this.id = id;
    }
}

function validateAge(age) {
    if (typeof age !== "number") {
        throw new ValidationError("age", "Age must be a number");
    }
    if (age < 0 || age > 150) {
        throw new ValidationError("age", `Age ${age} is out of range`);
    }
    return true;
}

try {
    validateAge(-5);
} catch (error) {
    if (error instanceof ValidationError) {
        console.log(`${error.name} on '${error.field}': ${error.message}`);
    }
}

try {
    throw new NotFoundError("User", 42);
} catch (error) {
    if (error instanceof NotFoundError) {
        console.log(`${error.name}: ${error.message}`);
    }
}
