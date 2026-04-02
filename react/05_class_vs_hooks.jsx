// ============================================================
// Class Components vs Hooks: Side-by-Side
// ============================================================
// This file shows the same Counter component built both ways
// so you can see exactly what hooks replaced.
// ============================================================

import React, { Component, useState, useEffect } from "react";

// ------------------------------------------------------------
// Class Component (pre-16.8)
// ------------------------------------------------------------

class CounterClass extends Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 };
    }

    // Runs once when the component is mounted
    componentDidMount() {
        console.log("Counter component has mounted!");

        setTimeout(() => {
            this.setState({ count: 5 });
            console.log("State updated after mount!");
        }, 2000);
    }

    increment = () => {
        this.setState({ count: this.state.count + 1 });
    };

    render() {
        return (
            <div>
                <h2>Count: {this.state.count}</h2>
                <button onClick={this.increment}>Increase</button>
            </div>
        );
    }
}

// ------------------------------------------------------------
// Functional Component with Hooks (16.8+)
// ------------------------------------------------------------

const CounterHooks = () => {
    const [count, setCount] = useState(0);

    // Replaces componentDidMount
    useEffect(() => {
        console.log("Counter component has mounted!");

        const timer = setTimeout(() => {
            setCount(5);
            console.log("State updated after mount!");
        }, 2000);

        // Replaces componentWillUnmount
        return () => {
            console.log("Counter component will unmount!");
            clearTimeout(timer);
        };
    }, []);

    // Replaces componentDidUpdate for 'count'
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

export { CounterClass, CounterHooks };
