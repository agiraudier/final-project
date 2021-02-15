import { Logo } from "./logo.js";
import { Component } from "react";
import { ProfilePic } from "./profilePic.js";
import { Uploader } from "./uploader.js";
import axios from "./axios.js";

export class App extends Component {
    constructor(props) {
        super(props);

        // Initialize App's state
        this.state = { uploaderVisible: false };

        // TODO: Bind methods if needed
        this.toggleUploader = this.toggleUploader.bind(this);
        this.setProfilePicUrl = this.setProfilePicUrl.bind(this);
    }

    componentDidMount() {
        // Special React Lifecycle Method
        // TODO: Make an axios request to fetch the user's data when the component mounts
        // TODO: update the state when the data is retrieved
        axios
            .get("/user", this.state)
            .then((resp) => {
                console.log("resp from axios user: ", resp);
                this.setState({
                    first: this.first,
                    lastName: this.last,
                    profilePicUrl: this.profile_pic_url,
                });
            })
            .catch((err) => {
                console.log("err in axios user: ", err);
            });
    }

    toggleUploader() {
        // TODO: Toggles the "uploaderVisible" state
        this.setState({
            uploaderVisible: !this.state.uploaderVisible,
        });
    }
    setProfilePicUrl(profilePicUrl) {
        // TODO: Updates the "profilePicUrl" in the state
        // TODO: Hides the uploader
        this.setState({
            profilePicUrl,
        });
    }

    render() {
        return (
            <div className={"app"}>
                <Logo />
                <ProfilePic
                    // Passing down props:
                    firstName={this.state.first}
                    lastName={this.state.last}
                    profilePicUrl={this.state.profilePicUrl}
                    // Passing down methods as standard functions (binding needed):
                    toggleUploader={this.toggleUploader}
                />
                {/*Conditionally render the Uploader: */}
                {this.state.uploaderVisible && (
                    <Uploader
                        // Passing down methods with arrow function (no binding needed):
                        setProfilePicUrl={() => this.setProfilePicUrl()}
                    />
                )}
            </div>
        );
    }
}
