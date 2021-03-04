import { Component } from "react";
import axios from "./axios.js";

export class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            bio: this.props.bio,
            editorVisible: false,
        };
        this.toggleEditor = this.toggleEditor.bind(this);
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
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

    handleClick() {
        axios
            .post("/bio", this.state)
            .then((resp) => {
                console.log("resp from bio: ", resp);
                this.setState({
                    editorVisible: false,
                    bio: resp.data.bio,
                });
            })
            .catch((err) => {
                console.log("err in bio: ", err);
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        if (this.state.editorVisible) {
            return (
                <div>
                    <h1 className="edition">EDITION MODE</h1>
                    <textarea
                        onChange={(e) => this.handleChange(e)}
                        defaultValue={this.state.bio}
                        name="bio"
                    ></textarea>{" "}
                    <br></br>
                    <button className="send" onClick={() => this.handleClick()}>
                        Save
                    </button>
                    {this.state.error && <p>Something broke :(</p>}
                </div>
            );
        }
        return (
            <div>
                <h4 className="bio">{this.props.bio}</h4>
                <button
                    className="send"
                    onClick={() => this.setState({ editorVisible: true })}
                >
                    Edit
                </button>
            </div>
        );
    }
}
