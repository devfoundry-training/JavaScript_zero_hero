// ============================================================
// React Context API
// ============================================================
// Context solves the "prop drilling" problem: passing props
// through components that don't need them just to reach a
// deeply nested child.
// ============================================================

import { createContext, useContext } from "react";

// ------------------------------------------------------------
// The Problem: Prop Drilling
// ------------------------------------------------------------

// Notice the theme prop is passed through every component,
// even though Parent and Child don't use it themselves.

function AppWithDrilling() {
    const theme = "dark";
    return <ParentDrill theme={theme} />;
}

function ParentDrill({ theme }) {
    return <ChildDrill theme={theme} />;
}

function ChildDrill({ theme }) {
    return <ThemedButtonDrill theme={theme} />;
}

function ThemedButtonDrill({ theme }) {
    return <button className={theme}>Themed Button</button>;
}

// The problems go deeper than verbosity. Every component needs
// updating if the structure changes, making it harder to
// scale and maintain.

// ------------------------------------------------------------
// The Solution: React Context API
// ------------------------------------------------------------

// Create a context with a default value
const ThemeContext = createContext("light");

function AppWithContext() {
    return (
        <ThemeContext.Provider value="dark">
            <ParentContext />
        </ThemeContext.Provider>
    );
}

// Parent and Child no longer need the theme prop at all
function ParentContext() {
    return <ChildContext />;
}

function ChildContext() {
    return <ThemedButtonContext />;
}

// Only the component that needs the value accesses it
function ThemedButtonContext() {
    const theme = useContext(ThemeContext);
    return <button className={theme}>Themed Button</button>;
}

export { AppWithDrilling, AppWithContext };
