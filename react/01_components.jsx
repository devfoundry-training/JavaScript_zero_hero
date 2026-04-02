// ============================================================
// React Components: Functional vs Class, Exports
// ============================================================
// React components are the building blocks of any React app.
// Since React 16.8, functional components with hooks are the
// standard. Class components still exist in older codebases.
// ============================================================

import React, { useState } from "react";

// ------------------------------------------------------------
// Basic Functional Component
// ------------------------------------------------------------

// A functional component is just a function that returns JSX.
// JSX is HTML-like syntax that gets transpiled into JavaScript.

function Greeting() {
    return <h1>Hello, welcome to React!</h1>;
}

export default Greeting;

// ------------------------------------------------------------
// Named Exports
// ------------------------------------------------------------

// You can export multiple components from the same file.

export function Welcome() {
    return <h1>Hello, welcome to React!</h1>;
}

export function Goodbye() {
    return <h1>Goodbye from React!</h1>;
}

// Consumed:
// import { Welcome, Goodbye } from './01_components';

// You can alias imports:
// import { Welcome as WelcomeMessage, Goodbye as FarewellMessage } from './01_components';

// ------------------------------------------------------------
// Class Component vs Functional Component
// ------------------------------------------------------------

// Class components are the older way of defining components.
// They are more verbose but you will see them in legacy code.

// Older class component
class CounterClassComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 };
    }

    handleIncrement = () => {
        this.setState({ count: this.state.count + 1 });
    };

    render() {
        return (
            <div>
                <h2>Class Component Counter: {this.state.count}</h2>
                <button onClick={this.handleIncrement}>Increment</button>
            </div>
        );
    }
}

// Functional component using hooks (preferred)
const CounterFunctionalComponent = () => {
    const [count, setCount] = useState(0);

    const handleIncrement = () => {
        setCount(count + 1);
    };

    return (
        <div>
            <h2>Functional Component Counter: {count}</h2>
            <button onClick={handleIncrement}>Increment</button>
        </div>
    );
};

// Main App showing both side by side
const App = () => {
    return (
        <div>
            <CounterClassComponent />
            <CounterFunctionalComponent />
        </div>
    );
};

export { CounterClassComponent, CounterFunctionalComponent, App };
