import React from "react";
import axios from "./axios";

import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
            email: "",
            password: "",
        };
    }

    handleClick() {
        axios
            .post("/login", this.state)
            .then((resp) => {
                console.log("resp from server: ", resp);
                if (!resp.data.success) {
                    this.setState({
                        error: true,
                    });
                } else {
                    location.replace("/");
                }
            })
            .catch((err) => {
                console.log("err in login: ", err);
                this.setState({
                    error: true,
                });
            });
    }

    handleChange(e) {
        // console.log("e target value: ", e.target.value);
        //console.log("e target name: ", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state after setState: ", this.state)
        );
    }

    render() {
        return (
            <div>
                {this.state.error && (
                    <p className="errorLog">
                        Something went wrong. Please try again.
                    </p>
                )}
                <h1 className="title">Log in</h1>
                {/* strategy #2 for binding: arrow functions! */}
                <input
                    className="regloginput"
                    onChange={(e) => this.handleChange(e)}
                    name="email"
                    type="text"
                    placeholder="email"
                />
                <br></br>
                <input
                    className="regloginput"
                    onChange={(e) => this.handleChange(e)}
                    name="password"
                    type="password"
                    placeholder="password"
                />
                <br></br>
                <button className="button" onClick={() => this.handleClick()}>
                    SUBMIT
                </button>
                <br></br>
                <div className="linkIntro">
                    <Link to="/reset">Forgot password?</Link>
                </div>
                <br></br>
                <div className="linkIntro">
                    <Link to="/">
                        You don't have an account yet? <br></br> Click here to
                        sign in!
                    </Link>
                </div>
            </div>
        );
    }
}
