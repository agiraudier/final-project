import { Component } from "react";
import axios from "./axios.js";

export class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
        };
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
}
