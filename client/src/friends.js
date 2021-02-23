import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import { getFriends, acceptFriend, unfriend } from "./actions.js";

export function Friends() {
    const dispatch = useDispatch();

    const wannabes = useSelector((state) => {
        return (
            state.users &&
            state.users.filter((friend) => friend.accepted == false)
        );
    });
    const friends = useSelector((state) => {
        return state.users && state.users.filter((friend) => friend.accepted);
    });

    useEffect(() => {
        dispatch(getFriends());
    }, []);

    if (!wannabes || !friends) {
        return null;
    }

    return (
        <div>
            <h4>Friends: </h4>

            {friends &&
                friends.map((friend) => (
                    <div key={friend.id}>
                        <p>
                            {friend.first} {friend.last}
                        </p>
                        <img src={friend.profile_pic_url}></img>

                        <button onClick={() => dispatch(unfriend(friend.id))}>
                            Delete
                        </button>
                    </div>
                ))}

            <h4>Friend requests: </h4>
            {wannabes &&
                wannabes.map((friend) => (
                    <div key={friend.id}>
                        <p>
                            {friend.first} {friend.last}
                        </p>
                        <img src={friend.profile_pic_url}></img>

                        <button
                            onClick={() => dispatch(acceptFriend(friend.id))}
                        >
                            Accept
                        </button>
                        <button onClick={() => dispatch(unfriend(friend.id))}>
                            Decline
                        </button>
                    </div>
                ))}
        </div>
    );
}
