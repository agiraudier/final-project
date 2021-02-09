/*import ReactDOM from "react-dom";

ReactDOM.render(<HelloWorld />, document.querySelector("main"));

function HelloWorld() {
    return <div>Hello, World!</div>;
}
*/
import ReactDOM from "react-dom";
import Welcome from "./welcome";

let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    elem = <p>Im not the welcome route!</p>;
}

ReactDOM.render(elem, document.querySelector("main"));
