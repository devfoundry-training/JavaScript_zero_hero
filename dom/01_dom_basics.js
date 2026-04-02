// ============================================================
// DOM Manipulation: Selectors, Events, Dynamic Content
// ============================================================
// This file is designed to run in a browser console or linked
// to an HTML file. It will not produce output in Node.js.
// ============================================================

// ------------------------------------------------------------
// Selecting Elements
// ------------------------------------------------------------

// By ID: returns single element or null
// const header = document.getElementById("header");

// By CSS selector: returns first match or null
// const firstButton = document.querySelector(".btn");
// const nav = document.querySelector("nav > ul");

// All matching: returns NodeList (array-like)
// const allButtons = document.querySelectorAll(".btn");

// Older methods (still work, less flexible)
// document.getElementsByClassName("btn");   // HTMLCollection
// document.getElementsByTagName("p");       // HTMLCollection

// ------------------------------------------------------------
// Modifying Elements
// ------------------------------------------------------------

// Text content
// header.textContent = "Updated Title";       // plain text
// header.innerHTML = "<em>Updated</em> Title"; // parses HTML

// Attributes
// const link = document.querySelector("a");
// link.setAttribute("href", "https://example.com");
// link.getAttribute("href");
// link.removeAttribute("target");

// CSS classes
// header.classList.add("active");
// header.classList.remove("hidden");
// header.classList.toggle("highlight");
// header.classList.contains("active"); // true

// Inline styles (avoid where possible, prefer CSS classes)
// header.style.color = "blue";
// header.style.fontSize = "24px";

// ------------------------------------------------------------
// Creating and Inserting Elements
// ------------------------------------------------------------

// const list = document.querySelector("ul");
// const newItem = document.createElement("li");
// newItem.textContent = "New item";
// newItem.classList.add("list-item");

// list.appendChild(newItem);           // add to end
// list.prepend(newItem);              // add to start
// list.insertBefore(newItem, list.firstChild); // before a reference

// Remove an element
// newItem.remove();

// ------------------------------------------------------------
// Event Handling
// ------------------------------------------------------------

// addEventListener is the standard approach
// const btn = document.querySelector("#submit");
// btn.addEventListener("click", (event) => {
//     event.preventDefault(); // stop default form submission
//     console.log("Button clicked");
//     console.log("Target:", event.target);
// });

// Common events:
//   click, dblclick, mouseenter, mouseleave
//   keydown, keyup, keypress
//   submit, change, input, focus, blur
//   DOMContentLoaded, load, resize, scroll

// ------------------------------------------------------------
// Event Delegation: handle events on dynamic content
// ------------------------------------------------------------

// Instead of adding listeners to every child element,
// add one to the parent and check event.target:

// const list = document.querySelector("ul");
// list.addEventListener("click", (event) => {
//     if (event.target.tagName === "LI") {
//         console.log("Clicked:", event.target.textContent);
//     }
// });

// This works even for elements added after the listener was attached.

// ------------------------------------------------------------
// Form Handling
// ------------------------------------------------------------

// const form = document.querySelector("form");
// form.addEventListener("submit", (event) => {
//     event.preventDefault();
//
//     const formData = new FormData(form);
//     const name = formData.get("name");
//     const email = formData.get("email");
//
//     console.log(`Name: ${name}, Email: ${email}`);
// });

// ------------------------------------------------------------
// DOMContentLoaded: wait for HTML to be parsed
// ------------------------------------------------------------

// document.addEventListener("DOMContentLoaded", () => {
//     console.log("DOM is ready");
//     // Safe to query elements here
// });

// Note: scripts with defer attribute or placed at end of <body>
// don't need this. The DOM is already available.

console.log("DOM module loaded. Run this in a browser, not Node.js.");
