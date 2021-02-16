import { Component } from "react";
import axios from "./axios.js";

export class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            file: null,
        };
        this.uploadImg = this.uploadImg.bind(this);
    }

    handleChange(e) {
        // console.log("e target value: ", e.target.value);
        //console.log("e target name: ", e.target.name);
        this.setState(
            {
                file: e.target.files[0],
            },
            () => console.log("this.state after setState: ", this.state)
        );
    }

    uploadImg() {
        let formData = new FormData();
        formData.append("file", this.state.file);

        axios
            .post("/profilePic", formData)
            .then((resp) => {
                this.props.setProfilePicUrl(resp.data.rows);
            })
            .catch((err) => {
                console.log("err in uploadImg: ", err);
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        return (
            <div>
                <input
                    name="file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => this.handleChange(e)}
                ></input>
                <button onClick={(e) => this.uploadImg(e)}>Upload</button>
            </div>
        );
    }
}
