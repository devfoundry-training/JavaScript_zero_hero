// ============================================================
// Control Flow: if/else, switch, ternary
// ============================================================

// ------------------------------------------------------------
// if / else if / else
// ------------------------------------------------------------

const score = 85;

if (score >= 90) {
    console.log("Grade: A");
} else if (score >= 75) {
    console.log("Grade: B");
} else if (score >= 60) {
    console.log("Grade: C");
} else {
    console.log("Grade: F");
}

// Combining conditions
const isMember = true;
const hasCoupon = false;

if (isMember || hasCoupon) {
    console.log("Discount applied");
}

// ------------------------------------------------------------
// switch
// ------------------------------------------------------------

const day = "Saturday";

switch (day) {
    case "Monday":
    case "Tuesday":
    case "Wednesday":
    case "Thursday":
    case "Friday":
        console.log("Weekday");
        break;
    case "Saturday":
    case "Sunday":
        console.log("Weekend");
        break;
    default:
        console.log("Invalid day");
}

// ------------------------------------------------------------
// Ternary: compact conditional expression
// ------------------------------------------------------------

const age = 20;
const status = age >= 18 ? "Adult" : "Minor";
console.log(`Age ${age}: ${status}`);

// Nested ternary (avoid in production, hard to read)
const tier = score >= 90 ? "Gold" : score >= 75 ? "Silver" : "Bronze";
console.log(`Tier: ${tier}`);
