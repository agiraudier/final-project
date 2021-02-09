// src/helloWorld.js
import Greetee from "./greetee";
import Counter from "./counter";

// this is a functional component whose job is only to render information
// (they cannot have state)
export default function HelloWorld() {
    const name = "Andrea";
    return (
        <div className="adobo">
            <div>
                Hello <Greetee firstName={name} />
            </div>
            <div>
                Hello <Greetee firstName="Adobo" />
            </div>
            <div>
                Hello <Greetee />
            </div>
            <Counter />
        </div>
    );
}

// pay mind as to how we pass information from parent to child above!
