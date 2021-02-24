import axios from "./axios";

export async function getFriends() {
    try {
        const { data } = await axios.get("/get-friends");
        console.log("this data getFriends: ", data);

        return {
            type: "GET_WANNABE_FRIENDS",
            friendsList: data.rows,
            userId: data.userId,
        };
    } catch (err) {
        console.log("err in axios acceptFriend: ", err);
    }
    /*
    axios
        .get("/get-friends")
        .then(({ data }) => {
            console.log("data in axios getFriends: ", data);
            return {
                type: "GET_WANNABE_FRIENDS",
                data: data,
            };
        })
        .catch((err) => {
            console.log("err in axios getFriends: ", err);
        });*/
}

export async function acceptFriend(id) {
    try {
        const { data } = await axios.post(`/api/friends/${id}`, {
            button: "Accept friendship",
        });
        console.log("this data acceptFriend: ", data);

        return {
            type: "ACCEPTED_FRIENDS",
            friendsList: data.rows,
            id: id,
        };
    } catch (err) {
        console.log("err in axios acceptFriend: ", err);
    }
    /*
    axios
        .post("/friends")
        .then(({ data }) => {
            console.log("data in axios acceptFriend: ", data);
            return {
                type: "ACCEPTED_FRIENDS",
                data: data,
                id: id,
            };
        })
        .catch((err) => {
            console.log("err in axios acceptFriend: ", err);
        });*/
}

export async function unfriend(id) {
    try {
        const { data } = await axios.post(`/api/friends/${id}`, {
            button: "Cancel friendship",
        });
        console.log("this data unfriend: ", data);
        return {
            type: "END_FRIENDS",
            friendsList: data.rows,
            id: id,
        };
    } catch (err) {
        console.log("err in axios unFriend: ", err);
    }
    /*
    axios
        .post("/friends")
        .then(({ data }) => {
            console.log("data in axios unfriend: ", data);
            return {
                type: "END_FRIENDS",
                data: data,
                id: id,
            };
        })
        .catch((err) => {
            console.log("err in axios unfriend: ", err);
        });*/
}

export async function recentMessages(msgs) {
    try {
        return {
            type: "RECENT_MESSAGES",
            data: msgs,
        };
    } catch (err) {
        console.log("err in actions recentMessages: ", err);
    }
}

export async function newMessage(message) {
    try {
        return {
            type: "NEW_MESSAGE",
            data: message,
        };
    } catch (err) {
        console.log("err in actions newMessage: ", err);
    }
}
