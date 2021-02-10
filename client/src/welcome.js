import Registration from "./registration";
import { HashRouter, Route } from "react-router-dom";
import Login from "./login";
import Reset from "./reset";

// "dumb"/"presentational" are alternative names for function components
export default function Welcome() {
    return (
        <div>
            <h1>Welcome</h1>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset" component={Reset} />
                </div>
            </HashRouter>
        </div>
    );
}
