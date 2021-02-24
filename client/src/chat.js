import { useState, useRef } from "react";

import { useSelector } from "react-redux";

import { socket } from "./socket.js";

export function Chat() {
    const textRef = useRef();
    const [text, setText] = useState("");

    const messages = useSelector((state) => state.messages);

    const sendMessage = (e) => {
        if (e.key === "Enter" && textRef.current.value != 0) {
            socket.emit("messages", text);
            console.log("target value: ", e.target.value);
            e.target.value = "";
        }
    };
    /*
    const changeMessage = (e) => {
        textRef.current.value = e.target.value;
    };

    const sendMessage = () => {
        console.log("current value: ", textRef.current.value);
        if (textRef.current.value != 0) {
            socket.emit("messages", textRef.current.value);
            textRef.current.value = "";
        }
    };
    const enter = (e) => {
        if (e.key === "enter") {
            e.preventDefault();
            sendMessage();
        }
    };*/

    return (
        <div>
            <h3>Chat</h3>
            {messages &&
                messages.map((text) => (
                    <div key={text.id}>
                        <img src={text.profile_pic_url}></img>
                        <p>
                            {text.first} {text.last} on {text.timestamp}
                        </p>

                        <p>{text.text}</p>
                    </div>
                ))}
            <textarea
                ref={textRef}
                name="message"
                placerholder="Write here"
                onKeyDown={(e) => sendMessage(e)}
            ></textarea>
            <button
                onChange={(e) => setText(e.target.value)}
                onClick={() => sendMessage()}
            >
                Send
            </button>
        </div>
    );
}
