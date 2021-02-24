/*import ReactDOM from "react-dom";

ReactDOM.render(<HelloWorld />, document.querySelector("main"));

function HelloWorld() {
    return <div>Hello, World!</div>;
}
*/
import ReactDOM from "react-dom";

import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import { reducer } from "./reducer";
import { init } from "./socket.js";
import Welcome from "./welcome";
import { App } from "./app.js";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    init(store);
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(elem, document.querySelector("main"));
