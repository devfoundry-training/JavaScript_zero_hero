# Tasks: the Library Manager

One set of tasks for every Zero to Hero repo (Python, Java, C#, C++, JavaScript; the SQL repo uses the same schema
and data in its own order). Every language gets the same briefs, the same sample data and the same expected output.
Only the code differs.

There are 12 tasks and a bonus, one for the end of each session. Each task combines everything taught in that
session and builds on the task before, so by the end the learner has one working program, the **Library Manager**:
from a fixed array of ten books to a tested REST API over a SQLite database.

## Core, Stretch and Challenge

Every task has three levels:

- **Core** is for everyone. `expected.txt` is the exact Core output for the sample data, and it is what the checker
  compares.
- **Stretch** is for those who finish early. A solution prints its Stretch output only when asked (see the running
  section below), so its default run always matches `expected.txt`.
- **Challenge** is for the strongest learners or for homework. The solutions cover Core and Stretch only.

## Session to task map

The topic folders each task follows in each repo. "(no topic yet)" marks a session the repo does not teach today:
the task still works, but the repo needs a short topic file before the task is used on a course.

| # | Task | Session | Python | Java | C# | C++ | JavaScript |
|---|---|---|---|---|---|---|---|
| 01 | Bookshelf | types, operators, conditionals, switch, arrays | basics | basics, control_flow | datatypes, operators, control_flow | basics, control_flow | basics, control_flow |
| 02 | Search and report | loops, strings | iteration | iteration, basics (strings) | iteration, string_manipulation | iteration | iteration |
| 03 | Functions and a menu | functions, modules | functions, module_packages | functions | (no topic yet) | functions, compilation | functions |
| 04 | Dynamic catalogue | collections | collections | collections | collections, linq | collections | collections |
| 05 | Classes | classes, encapsulation | oop | oop | oop | oop | oop |
| 06 | Book types and loan policies | inheritance, interfaces, polymorphism | oop | oop | oop | oop, memory | oop |
| 07 | Errors done properly | exceptions | exceptions | exceptions | exceptions | exceptions | exceptions |
| 08 | Persistence | file I/O, CSV, JSON | io | io | io | io | (no topic yet) |
| 09 | Loans with due dates | dates | (no topic yet) | datetime | (no topic yet) | datetime | (no topic yet) |
| 10 | SQLite storage | databases | databases | databases | (no topic yet) | c_interop (C API) | (no topic yet) |
| 11 | Test the rules | testing, TDD | testing | testing | CS_zero_heroTests | testing | (no topic yet) |
| 12 | Expose the library | HTTP APIs | apis | apis | (no topic yet) | (no topic yet) | async |
| B | Busy library (bonus) | concurrency | (no topic yet) | concurrency | (no topic yet) | concurrency | async |

**SQL repo:** the same `schema.sql`, `seed.sql` and CSV data, with eight tasks (S1 to S8) in SQL's own order:
SELECT, filtering, joins, aggregation, subqueries and views, window functions, design (a `reservations` table, as in
task 10 Challenge 2) and transactions (a borrow that rolls back, as in task 10 Stretch 1).

## Choosing tasks: 3 days or 5 days

**5-day course:** all 12, one or two per half day in order, with B for groups that finish early or as homework.

| Day | Tasks |
|---|---|
| 1 | 01, 02, 03 |
| 2 | 04, 05, 06 |
| 3 | 07, 08, 09 |
| 4 | 10, 11 |
| 5 | 12, B (bonus) |

**3-day course:** these 8, which follow the usual fundamentals order and make one program end to end:

| Day | Tasks | Why |
|---|---|---|
| 1 | 01, 02, 03 | the language basics, ending with a working menu |
| 2 | 04, 05, 06 | collections and the object model the rest depends on |
| 3 | 07, 08 | errors and files: a program that survives bad input and keeps its data |

Swaps for a 3-day group with different needs (the starters carry the previous solution, so skipping is safe):

- **Testing focus:** replace 08 with 11 (start from the task 11 starter; the date tests use the model it provides).
- **Strong group:** fold 02 into 01 (Core only) and add 09 on day 3.
- **Web focus:** replace 06 with 12 on day 3 (start from the task 12 starter).

## What is in this folder

```
tasks/
  README.md              this file
  data/                  sample data, identical in every repo: books, members, loans, schema.sql, seed.sql
  check/check.py         the checker (Python 3.10 or later, standard library only)
  check/api_script.json  the requests the checker sends in task 12
  01_bookshelf/
    README.md            the brief: Core, Stretch, Challenge, data contract, output format, language notes
    expected.txt         the exact Core output for the sample data
    starter/             builds and runs as it is; unfinished parts say "not implemented"
    solution/            Core and Stretch, passes the check
  ...
  12_library_api/        also expected_stretch.txt (the Open Library summary)
  B_busy_library/        bonus: concurrency
```

Each `starter/` contains the previous task's solution (or the parts of it the task builds on) plus stubs for the
new work, so a group can start any task without having finished the one before. Task B stands alone, so it can
follow any task from 07 on.

## The checker

`check/check.py TASK [--expected FILE] [--timeout SECS] -- COMMAND ...` runs the command and prints `PASS`, or
`FAIL` with the first line that differs. Exit code 0 is a pass. It needs Python 3.10 or later and nothing else.

- Line endings, trailing spaces and trailing blank lines do not count; everything else does.
- Tasks 03 and 07 read commands from standard input: the checker feeds in `data/input_03.txt` and
  `data/input_07.txt` itself.
- Task 11 runs the tests and passes when the run succeeds and every test name in `expected.txt` appears in the
  output.
- Task 12 starts the server on a free port (`{port}` in the command is replaced with it), sends the requests in
  `check/api_script.json`, compares the answers with `expected.txt`, then stops the server.

## Conventions every solution follows

| Rule | Detail |
|---|---|
| Output | Exactly `expected.txt`: no extra lines, no prompts, no colours. Debug output goes to stderr. |
| Data folder | Tasks 08 to 12 take it as the first argument, default `tasks/data`. Tasks 01 to 07 carry their data in the code. |
| Today | Tasks 09 and 10 take today's date as the second argument, default `2026-10-12`; task 12 uses `2026-10-12`. Nothing reads the real clock. |
| Port | Task 12 takes the port as the second argument, default `8080`. |
| Written files | Tasks 08 and 10 write into `out/` in the current directory (git-ignored). |
| Money | Integer pence everywhere, shown as `£1.25`. |
| Sorting text | A-Z means lower-case, character by character (ordinal). Never a locale-aware compare. |

## Running and checking: JavaScript

Node.js 22.13 or later (tested on Node 24). Everything the tasks use is built into Node: `node:readline`,
`node:fs`, `node:sqlite`, `node:test` and `node:http`. There is nothing to install. The `package.json` in this
folder makes every `.js` file here an ES module (`import` / `export`).

Run every command from the repo root. On macOS and Linux use `python3` instead of `py -3.13`.

| Task | Run | Check |
|---|---|---|
| 01, 02, 04, 05, 06, B | `node tasks/01_bookshelf/solution/main.js` | `py -3.13 tasks/check/check.py 01 -- node tasks/01_bookshelf/solution/main.js` |
| 03, 07 | `node tasks/03_functions/solution/main.js < tasks/data/input_03.txt` | `py -3.13 tasks/check/check.py 03 -- node tasks/03_functions/solution/main.js` |
| 08, 09, 10 | `node tasks/09_due_dates/solution/main.js tasks/data` | `py -3.13 tasks/check/check.py 09 -- node tasks/09_due_dates/solution/main.js tasks/data` |
| 11 | `node --test tasks/11_testing/solution/library.test.js` | `py -3.13 tasks/check/check.py 11 -- node --test tasks/11_testing/solution/library.test.js` |
| 12 | `node tasks/12_library_api/solution/main.js tasks/data 8080` | `py -3.13 tasks/check/check.py 12 -- node tasks/12_library_api/solution/main.js tasks/data {port}` |
| 12 Stretch | `node tasks/12_library_api/solution/main.js --summarise tasks/data/openlibrary_dune.json` | `py -3.13 tasks/check/check.py 12_stretch -- node tasks/12_library_api/solution/main.js --summarise tasks/data/openlibrary_dune.json` |

Swap the task number and folder for the task you are on, and `solution` for `starter` to check your own work. Add
`--stretch` to a run (not a check) to see the Stretch output.

`npm test` (from the repo root) runs the task 11 solution's tests.
