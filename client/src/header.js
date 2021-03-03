import { LogoHeader } from "./logoHeader.js";
//import { ProfilePic } from "./profilePic.js";

import { Link } from "react-router-dom";

export function Header() {
    return (
        <header>
            <div>
                <Link to="/">
                    <LogoHeader />
                </Link>
            </div>
            <div className="totalIcons">
                <Link to="/logout">
                    <img className="icon" src="./power.svg"></img>
                </Link>
                <Link to="/profile">
                    <img className="icon" src="./profile.svg"></img>
                </Link>
                <Link to="/chat">
                    <img className="icon" src="./chat.svg"></img>
                </Link>

                <Link to="/canvas">
                    <img className="icon" src="./brush.svg"></img>
                </Link>
                <Link to="/users">
                    <img className="icon" src="./search.svg"></img>
                </Link>
                <Link to="/">
                    <img className="icon" src="./dashboard.svg"></img>
                </Link>
            </div>
        </header>
    );
}
