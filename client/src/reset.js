import React from "react";
import axios from "./axios";

import { Link } from "react-router-dom";

export default class Reset extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
            renderView: 1,
        };
    }

    handleClick() {
        axios
            .post("/password/reset/start", this.state)
            .then((resp) => {
                //console.log("resp from server: ", resp);
                if (!resp.data.success) {
                    this.setState({
                        error: true,
                    });
                    location.replace("/password/reset/start");
                } else {
                    this.setState({
                        renderView: 2,
                    });
                }
            })
            .catch((err) => {
                console.log("err in email entered when reseting pw: ", err);
                this.setState({
                    error: true,
                });
            });
    }

    handleVerification() {
        axios
            .post("/password/reset/verify", this.state)
            .then((resp) => {
                //console.log("resp from server: ", resp);
                if (!resp.data.success) {
                    this.setState({
                        error: true,
                    });
                    location.replace("/password/reset/start");
                } else {
                    this.setState({
                        renderView: 3,
                    }).catch((err) => {
                        console.log("err in rendering view 3: ", err);
                    });
                }
            })
            .catch((err) => {
                console.log("err in changing the pw: ", err);
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

    orderRenderView() {
        if (this.state.renderView === 1) {
            return (
                <div>
                    <input
                        className="regloginput"
                        onChange={(e) => this.handleChange(e)}
                        name="email"
                        type="text"
                        placeholder="email"
                    />
                    <br></br>
                    <button
                        className="button"
                        onClick={() => this.handleClick()}
                    >
                        NEXT
                    </button>
                </div>
            );
        } else if (this.state.renderView === 2) {
            return (
                <div>
                    <p></p>
                    <input
                        className="regloginput"
                        onChange={(e) => this.handleChange(e)}
                        name="password"
                        type="password"
                        placeholder="New Password"
                    />
                    <br></br>
                    <input
                        className="regloginput"
                        onChange={(e) => this.handleChange(e)}
                        name="code"
                        type="text"
                        placeholder="code"
                    />
                    <br></br>
                    <button
                        className="button"
                        onClick={() => this.handleVerification()}
                    >
                        NEXT
                    </button>
                </div>
            );
        } else if (this.state.renderView === 3) {
            return (
                <div>
                    <h1>success</h1>
                    <Link to="/login">Back to log in.</Link>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                {this.state.error && <p>Something broke :(</p>}

                {this.orderRenderView()}
            </div>
        );
    }
}
