import { recentMessages, newMessage } from "./actions.js";
import { io } from "socket.io-client";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", (msgs) =>
            store.dispatch(recentMessages(msgs))
        );

        socket.on("messages", (message) => store.dispatch(newMessage(message)));
    }
};
