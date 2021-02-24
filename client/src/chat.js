import { useState, useRef } from "react";

import { useSelector } from "react-redux";

import { socket } from "./socket.js";

export function Chat() {
    const textRef = useRef();
    //const [text, setText] = useState("");
    const [inputField, setInputField] = useState("");

    const messages = useSelector((state) => state.messages);

    const sendMessage = (e) => {
        if (e.key === "Enter" && textRef.current.value != 0) {
            socket.emit("messages", inputField);
            console.log("target value: ", e.target.value);
            e.target.value = "";
        }
    };

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
                value={inputField}
                placerholder="Write here"
                onChange={(e) => {
                    setInputField(e.target.value);
                }}
                onKeyDown={(e) => sendMessage(e)}
            ></textarea>
            <button onClick={(e) => sendMessage(e)}>Send</button>
        </div>
    );
}
