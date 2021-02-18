import { Component } from "react";
import axios from "./axios.js";
import { Logo } from "./logo.js";
import { Uploader } from "./uploader.js";
import { Profile } from "./profile.js";
import { ProfilePic } from "./profilePic.js";
import { OtherProfile } from "./otherProfile.js";
import { BrowserRouter, Route } from "react-router-dom";

export class App extends Component {
    constructor(props) {
        super(props);

        // Initialize App's state
        this.state = {
            uploaderVisible: false,
            firstName: "",
            lastName: "",
            profilePicUrl: "",
            bio: "",
        };

        // TODO: Bind methods if needed
        this.toggleUploader = this.toggleUploader.bind(this);
        this.setProfilePicUrl = this.setProfilePicUrl.bind(this);
    }

    componentDidMount() {
        // Special React Lifecycle Method
        // TODO: Make an axios request to fetch the user's data when the component mounts
        // TODO: update the state when the data is retrieved
        axios
            .get("/api/user")
            .then((res) => {
                console.log("resp from axios user: ", res);
                this.setState({
                    id: res.data.rows.id,
                    firstName: res.data.rows.first,
                    lastName: res.data.rows.last,
                    profilePicUrl: res.data.rows.profile_pic_url,
                    bio: res.data.rows.bio,
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
            profilePicUrl: profilePicUrl,
        });
    }

    render() {
        return (
            <div className={"app"}>
                <Logo />
                <ProfilePic
                    id={this.state.id}
                    firstName={this.state.firstName}
                    lastName={this.state.lastName}
                    profilePicUrl={this.state.profilePicUrl}
                    toggleUploader={this.toggleUploader}
                />
                {/*Conditionally render the Uploader: */}
                {this.state.uploaderVisible && (
                    <Uploader
                        // Passing down methods with arrow function (no binding needed):
                        setProfilePicUrl={this.setProfilePicUrl}
                    />
                )}
                <BrowserRouter>
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                // Passing down props:
                                id={this.state.id}
                                firstName={this.state.firstName}
                                lastName={this.state.lastName}
                                profilePicUrl={this.state.profilePicUrl}
                                bio={this.state.bio}
                                // Passing down methods as standard functions (binding needed):
                            />
                        )}
                    />
                    <Route
                        path="/user/:id"
                        render={(props) => (
                            <OtherProfile
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                </BrowserRouter>
            </div>
        );
    }
}
