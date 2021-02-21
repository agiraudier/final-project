import { useState, useEffect } from "react";
import axios from "./axios";

export function FriendshipButton(props) {
    const [button, setButton] = useState("");
    //const [error, setError] = useState(false);

    useEffect(() => {
        let abort = false;
        axios
            .get(`/api/friends/${props.id}`)
            .then(({ data }) => {
                console.log("data in axios Friendshipbutton: ", data);
                if (!abort) {
                    console.log(data.rows);
                    setButton(data.button);
                } else {
                    abort = true;
                }
            })
            .catch((err) => {
                console.log("this err in axios friendshipButton : ", err);
            });
    }, []);

    const setSubmit = () => {
        axios
            .post(`/api/friends/${props.id}`, { button: button })
            .then(({ data }) => {
                console.log("data in axios setSubmit: ", data);
                setButton(data.button);
            });
    };
    // needs to get passed the id of the user that we are currently viewing
    // we will either want to befriend that user, cancel a request we made in the past,
    // accept a pending friend request, or end our friendship
    // the id of the other user lives in the OtherProfile component

    // in useEffect we will want to make a request to the server to find out our
    // relationship status with the user we are looking at, and send over some button text

    // on submit/ btn click we want to send the button text to the server,
    //to update our db, and change the btn text asgain, once the DB has
    // been successfully updated

    return (
        <>
            <button className="btn" onClick={() => setSubmit()}>
                {" "}
                {button}
            </button>
        </>
    );
}
