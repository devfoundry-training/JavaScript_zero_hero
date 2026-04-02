// ============================================================
// React Hooks
// ============================================================
// Hooks let you use state and lifecycle features in functional
// components. Introduced in React 16.8.
// ============================================================

import React, {
    useState, useEffect, useContext, useRef,
    useMemo, useCallback, useReducer, useLayoutEffect,
    useImperativeHandle, forwardRef, useDebugValue,
    createContext
} from "react";

// ------------------------------------------------------------
// useState: manages component state
// ------------------------------------------------------------

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increase</button>
        </div>
    );
}

// ------------------------------------------------------------
// useEffect: runs side effects (fetching data, setting up listeners)
// ------------------------------------------------------------

function Timer() {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((s) => s + 1);
        }, 1000);

        return () => clearInterval(interval); // Cleanup function
    }, []); // Empty array = runs only on mount

    return <p>Timer: {seconds} seconds</p>;
}

// ------------------------------------------------------------
// useEffect: lifecycle comparison
// ------------------------------------------------------------

// This shows how useEffect replaces class lifecycle methods.

const CounterWithLifecycle = () => {
    const [count, setCount] = useState(0);

    // componentDidMount equivalent
    useEffect(() => {
        console.log("Counter component has mounted!");

        const timer = setTimeout(() => {
            setCount(5);
            console.log("State updated after mount!");
        }, 2000);

        // componentWillUnmount equivalent
        return () => {
            console.log("Counter component will unmount!");
            clearTimeout(timer);
        };
    }, []);

    // componentDidUpdate equivalent (runs whenever 'count' changes)
    useEffect(() => {
        console.log("Counter component has updated!");
        console.log(`Previous count: ${count - 1}, Current count: ${count}`);
    }, [count]);

    const increment = () => {
        setCount(count + 1);
    };

    return (
        <div>
            <h2>Count: {count}</h2>
            <button onClick={increment}>Increase</button>
        </div>
    );
};

// ------------------------------------------------------------
// useContext: provides global state without prop drilling
// ------------------------------------------------------------

const ThemeContext = createContext("light");

function ThemedComponent() {
    const theme = useContext(ThemeContext);
    return <p>Current theme: {theme}</p>;
}

// ------------------------------------------------------------
// useRef: accesses DOM elements without re-renders
// ------------------------------------------------------------

function FocusInput() {
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus(); // Auto-focus on mount
    }, []);

    return <input ref={inputRef} />;
}

// ------------------------------------------------------------
// useMemo: caches computed values to optimise performance
// ------------------------------------------------------------

function ExpensiveComponent({ num }) {
    const squaredNumber = useMemo(() => num * num, [num]);
    return <p>Squared: {squaredNumber}</p>;
}

// ------------------------------------------------------------
// useCallback: memoises functions to prevent unnecessary re-creations
// ------------------------------------------------------------

function Parent() {
    const [count, setCount] = useState(0);
    const memoizedHandleClick = useCallback(() => setCount((c) => c + 1), []);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={memoizedHandleClick}>Increase</button>
        </div>
    );
}

// ------------------------------------------------------------
// useReducer: alternative to useState for complex logic
// ------------------------------------------------------------

const reducer = (state, action) => {
    switch (action.type) {
        case "increment": return { count: state.count + 1 };
        case "decrement": return { count: state.count - 1 };
        default: return state;
    }
};

function CounterReducer() {
    const [state, dispatch] = useReducer(reducer, { count: 0 });

    return (
        <div>
            <p>Count: {state.count}</p>
            <button onClick={() => dispatch({ type: "increment" })}>+</button>
            <button onClick={() => dispatch({ type: "decrement" })}>-</button>
        </div>
    );
}

// ------------------------------------------------------------
// useLayoutEffect: runs before the browser paints the UI
// ------------------------------------------------------------

function LayoutExample() {
    const divRef = useRef(null);

    useLayoutEffect(() => {
        console.log(divRef.current.getBoundingClientRect());
    }, []);

    return <div ref={divRef}>Hello</div>;
}

// ------------------------------------------------------------
// useImperativeHandle: exposes child component methods to parent
// ------------------------------------------------------------

const CustomInput = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        focus: () => console.log("Focus triggered!"),
    }));
    return <input />;
});

function ParentWithImperativeHandle() {
    const inputRef = useRef(null);
    return (
        <div>
            <CustomInput ref={inputRef} />
            <button onClick={() => inputRef.current.focus()}>Focus Input</button>
        </div>
    );
}

// ------------------------------------------------------------
// useDebugValue: helps debug custom hooks
// ------------------------------------------------------------

function useCustomHook(initialValue) {
    const [value, setValue] = useState(initialValue);
    useDebugValue(value > 5 ? "Greater than 5" : "Less than or equal to 5");
    return [value, setValue];
}

// ------------------------------------------------------------
// Exports
// ------------------------------------------------------------

export {
    Counter,
    Timer,
    CounterWithLifecycle,
    ThemedComponent,
    FocusInput,
    ExpensiveComponent,
    Parent,
    CounterReducer,
    LayoutExample,
    ParentWithImperativeHandle
};
