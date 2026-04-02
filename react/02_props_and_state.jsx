// ============================================================
// Props and State
// ============================================================
// Props: passed from parent to child, read-only, unidirectional.
// State: managed inside the component, mutable, triggers re-render.
// ============================================================

import React, { useState, Component } from "react";
import ReactDOM from "react-dom";

// ------------------------------------------------------------
// Props
// ------------------------------------------------------------

// Props are passed from parent to child components.
// They are read-only: a child cannot change its own props.
// Data flows one way: parent to child.

function Greeting(props) {
    return <h1>Hello, {props.name}!</h1>;
}

function PropsExample() {
    return <Greeting name="John" />;
}

// ------------------------------------------------------------
// State with Hooks (functional component)
// ------------------------------------------------------------

// State is local data managed by the component itself.
// When state changes, React re-renders the component.
// Used for data that changes over time or in response to user actions.

function CounterWithHooks() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>Click me</button>
        </div>
    );
}

// ------------------------------------------------------------
// State with Class Component (pre-16.8)
// ------------------------------------------------------------

// The naming convention above makes more sense when you see how
// things used to look with class components:

class CounterWithClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        };
    }

    increment = () => {
        this.setState({
            count: this.state.count + 1
        });
    };

    render() {
        return (
            <div>
                <p>You clicked {this.state.count} times</p>
                <button onClick={this.increment}>Click me</button>
            </div>
        );
    }
}

// ------------------------------------------------------------
// Putting It Together
// ------------------------------------------------------------

function MainApp() {
    return (
        <div>
            <h2>Props Example</h2>
            <PropsExample />

            <h2>State Example with Hooks</h2>
            <CounterWithHooks />

            <h2>State Example in Class Component</h2>
            <CounterWithClass />
        </div>
    );
}

export { Greeting, CounterWithHooks, CounterWithClass, MainApp };
