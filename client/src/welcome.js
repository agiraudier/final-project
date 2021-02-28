import Registration from "./registration";
import { HashRouter, Route } from "react-router-dom";
import Login from "./login";
import Reset from "./reset";
import { Logo } from "./logo.js";
import { Footer } from "./footer.js";

// "dumb"/"presentational" are alternative names for function components
export default function Welcome() {
    return (
        <div>
            <div className="welcome">
                <Logo />
                <HashRouter>
                    <div className="reglogres">
                        <Route exact path="/" component={Registration} />
                        <Route path="/login" component={Login} />
                        <Route path="/reset" component={Reset} />
                    </div>
                </HashRouter>
                <div className="footerBox">
                    <Footer />
                </div>
            </div>
        </div>
    );
}
