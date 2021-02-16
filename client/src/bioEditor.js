import { Component } from "react";
import axios from "./axios.js";

export class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            file: null,
        };
        this.uploadImg = this.uploadImg.bind(this);
    }

    handleChange(e) {
        this.setState(
            {
                file: e.target.files[0],
            },
            () =>
                console.log(
                    "this.state after setState in BioEditor: ",
                    this.state
                )
        );
    }

    toggleEditor() {
        this.setState({
            editorVisible: !this.state.editorVisible,
        });
    }

    render() {
        if (this.state.editorVisible) {
            return <div></div>;
        }
    }
}
