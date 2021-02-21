import axios from "./axios";

export function getFriends() {
    axios.get("/api/get-friends").then(({ data }) => {
        console.log("data in axios getFriends: ", data);
    });
}
