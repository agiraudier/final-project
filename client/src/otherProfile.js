import { Component } from "react";

import { ImagesOthers } from "./imagesOthers.js";
import axios from "./axios";

export class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            id: this.props.id,
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            profilePicUrl: this.props.profilePicUrl,
            bio: this.props.bio,
        };
    }

    componentDidMount() {
        console.log("this.props.match: ", this.props.match);
        console.log("id: ", this.props.match.params.id);
        // we should  make a request to our server to get the other user's data using the id
        // If we are trying to view our own profile,
        // we should make sure to send the user back to the '/' route
        axios
            .get(`/api/otherProfile/${this.props.match.params.id}`)
            .then((res) => {
                //console.log("axios otherprofile: ", res);
                this.setState({
                    error: false,
                    id: res.data.rows.id,
                    firstName: res.data.rows.first,
                    lastName: res.data.rows.last,
                    profilePicUrl: res.data.rows.profile_pic_url,
                    bio: res.data.rows.bio,
                });
                if (this.props.match.params.id == res.data.rows.cookies) {
                    this.props.history.push("/");
                }
            })

            .catch((err) => {
                console.log("err in axios otherprofile: ", err);
                this.setState({
                    error: true,
                });
            });
    }
    render() {
        if (this.state.id) {
            return (
                <div>
                    <div className="Location">
                        <div className="profileBox">
                            <img
                                className="profilePic"
                                src={`${
                                    this.state.profilePicUrl || "/default.png"
                                }`}
                            ></img>
                        </div>
                    </div>
                    <h2 className="nameOther">
                        {this.state.firstName}_{this.state.lastName}
                    </h2>
                    <h4 className="bio">{this.state.bio}</h4>

                    <ImagesOthers id={this.state.id}></ImagesOthers>
                </div>
            );
        }
        return <div>{this.state.error && <p>Something broke :(</p>}</div>;
    }
}
