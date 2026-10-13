# JavaScript Zero to Hero

[![Tasks](https://github.com/devfoundry-training/JavaScript_zero_hero/actions/workflows/tasks.yml/badge.svg)](https://github.com/devfoundry-training/JavaScript_zero_hero/actions/workflows/tasks.yml)

A structured teaching repository covering JavaScript from variables and types through to async/await, DOM manipulation, and ES6+ patterns. Each module is a standalone, runnable file with inline commentary. Part of the Zero to Hero course family.

---

## Who Is This For?

- Developers learning JavaScript for the first time
- Delegates on instructor-led web development courses
- Self-learners who want a clear, progressive path through the language

No prior JavaScript experience is assumed. Basic comfort with a command line is helpful.

---

## Prerequisites

| Tool    | Minimum Version |
|---------|----------------|
| Node.js | 18+ for the topic modules, 22.13+ for the tasks (built-in `node:sqlite`) |
| Python  | 3.10+, only to run the task checker |

```bash
node --version
```

Most modules run in Node.js. The `dom/` module is designed for browser use.

---

## Getting Started

```bash
# Clone the repository
git clone git@github.com:Edrzapi/JavaScript_zero_hero.git
cd JavaScript_zero_hero

# Run any module directly
node basics/01_variables_types.js
node functions/01_functions.js
node async/01_promises_async.js
```

No dependencies to install: the core modules and the tasks use only the language and Node's built-in modules.

---

## Repository Structure

```
basics/          Variables, types, coercion, operators, destructuring
control_flow/    if/else, switch, ternary
iteration/       for, while, for...of, for...in, forEach
collections/     Arrays, objects, Map, Set
functions/       Declarations, arrows, closures, higher-order, callbacks
oop/             Classes, inheritance, private fields, static, polymorphism
exceptions/      try/catch/finally, custom error classes
async/           Callbacks, Promises, async/await, Promise.all
dom/             Selectors, events, dynamic content (browser)
react/           A preview of React: components, props, state, hooks, context (JSX, needs a React project to run)
practice/        Short fill-in exercises (they used to live in tasks/): basics, functions, async, OOP
tasks/           The Library Manager: 12 tasks and a bonus, with starters, solutions and a checker
package.json     No dependencies; npm test runs the task 11 tests
```

Testing (`node:test`), dates, files, databases and HTTP APIs have no topic file yet; tasks 08 to 12 cover them.

---

## Tasks

The [`tasks/`](tasks/README.md) folder holds the **Library Manager**, one practical project shared by every Zero to
Hero repo: 12 tasks and a bonus in Python, Java, C#, C++ and JavaScript, and eight tasks (S1 to S8) in SQL's own
order on the same database. Every repo uses the same briefs, the same sample data and the same expected output; only
the code differs.

- **One task per session.** Each task is the end-of-session check and builds on the one before, so by the end the
  learner has one working program.
- **Three levels:** Core (everyone), Stretch (for those who finish early) and Challenge (the strongest learners, or
  homework).
- **Every task folder** has the brief (`README.md`), the exact expected output (`expected.txt`), a `starter/` that
  runs as it is (unfinished parts say "not implemented") and a `solution/` with Core and Stretch.
- **One checker:** `tasks/check/check.py` (Python 3.10 or later, standard library only) runs a program and prints
  `PASS`, or `FAIL` with the first line that differs from `expected.txt`. On Windows, `py` works in place of
  `python`.

[tasks/README.md](tasks/README.md) has the session to task map, the 3-day and 5-day selections, and the run and
check command for every task. To check the first task's solution, from the repo root:

```bash
python tasks/check/check.py 01 -- node tasks/01_bookshelf/solution/main.js
```

---

## Topics Covered

### Core Language

- **Variables and Types**: `let`/`const`/`var`, primitives, template literals, type coercion, `===` vs `==`, truthy/falsy.
- **Operators**: Arithmetic, comparison, logical, nullish coalescing (`??`), optional chaining (`?.`), destructuring, spread.
- **Control Flow**: `if`/`else`, `switch`, ternary expressions.
- **Iteration**: `for`, `while`, `do...while`, `for...of`, `for...in`, `break`/`continue`, `forEach`.

### Data Structures

- **Arrays**: `push`/`pop`, `map`/`filter`/`reduce`, `find`/`some`/`every`, sorting, spread copy.
- **Objects**: Dot/bracket notation, `Object.keys`/`values`/`entries`, spread merge.
- **Map and Set**: Keyed collections, unique values, deduplication.

### Functions

- **Declarations and Arrows**: Hoisting, concise syntax, default parameters, rest parameters.
- **Higher-Order Functions**: Functions as arguments and return values, factory pattern.
- **Closures**: Encapsulation via captured scope, counter pattern.
- **Callbacks**: Async foundation, event-driven patterns.

### Object-Oriented Programming

- **Classes**: Constructors, methods, `toString()`.
- **Inheritance**: `extends`, `super`, method overriding, `instanceof`.
- **Encapsulation**: Private fields (`#`), getters/setters.
- **Polymorphism**: Shape hierarchy, dynamic dispatch.
- **Static Members**: Class-level methods and properties.

### Error Handling

- **try/catch/finally**: Exception flow, re-throwing, `instanceof` checks.
- **Custom Errors**: Extending `Error`, typed error handling.

### Async JavaScript

- **Callbacks**: setTimeout, callback pattern, callback hell.
- **Promises**: `new Promise`, `.then`/`.catch`, chaining.
- **async/await**: Syntactic sugar, error handling with try/catch.
- **Promise.all**: Parallel execution, `allSettled`, `race`, `any`.

### DOM (Browser)

- **Selectors**: `querySelector`, `querySelectorAll`, `getElementById`.
- **Manipulation**: `textContent`, `innerHTML`, `classList`, attributes.
- **Events**: `addEventListener`, event delegation, form handling.
- **Dynamic Content**: `createElement`, `appendChild`, `remove`.

---

## Teaching Approach

- Each file is standalone: run it directly with `node` or in a browser console
- Concepts are explained in comments alongside working code
- Topics progress from simple to complex within each module
- No frameworks, no build tools: pure JavaScript throughout (the `react/` folder is an optional preview)
- DOM module is designed for browser use; all other modules run in Node.js

---

## Tech Stack

| Technology    | Purpose |
|---------------|---------|
| JavaScript    | Language (ES2022+) |
| Node.js 18+   | Runtime for non-browser modules |

No TypeScript. No bundlers. Pure JavaScript (apart from the optional `react/` preview).

---

## What's Next?

This course covers JavaScript fundamentals. For React, Express, and applied web development, see the related repositories on this profile.

For the same structured approach in other languages, see the companion courses:

- [Python Zero to Hero](https://github.com/Edrzapi/Python_zero_hero)
- [Java Zero to Hero](https://github.com/Edrzapi/Java_zero_hero)
- [C# Zero to Hero](https://github.com/Edrzapi/CS_zero_hero)
- [SQL Zero to Hero](https://github.com/Edrzapi/SQL_zero_hero)
