// src/registration.js
// class component have state!
// (class components also have lifecycle methods (like componentDidMount))
import React from "react";
import axios from "./axios";

import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
            first: "",
            last: "",
            email: "",
            password: "",
        };
        // strategy #1 for binding
        // this.handleChange = this.handleChange.bind(this);
    }

    // 1. we need to store the user's input in state
    // 2. when user clicks "submit," we need to take the input we got from the user
    // and send it off to the server in a `POST` request

    handleClick() {
        // remaining tasks: make the red underlines go away!
        axios
            .post("/registration", this.state)
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
                console.log("err in registration: ", err);
                this.setState({
                    error: true,
                });
                // render an error message
            });
    }

    // this is how we handle user input in React!
    handleChange(e) {
        // console.log("e target value: ", e.target.value);
        // which input field is the user typing in?
        console.log("e target name: ", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state after setState: ", this.state)
        );
        // this.setState is used to put/update state!
        // if (e.target.name === "first") {
        //     this.setState({
        //         first: e.target.value,
        //     });
        // } else if (e.target.name === "last") {
        //     this.setState({
        //         last: e.target.value,
        //     });
        // }
    }

    render() {
        return (
            <div>
                {this.state.error && <p>Something broke :(</p>}
                <h1>Registration</h1>
                {/* strategy #2 for binding: arrow functions! */}
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="first"
                    type="text"
                    placeholder="first"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="last"
                    type="text"
                    placeholder="last"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="email"
                    type="text"
                    placeholder="email"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="password"
                    type="password"
                    placeholder="password"
                />
                <button onClick={() => this.handleClick()}>submit</button>
                <Link to="/login">You already have an account? Log in.</Link>
            </div>
        );
    }
}
