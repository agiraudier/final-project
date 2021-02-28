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
        <div className="chat">
            <h3 className="chatTitle">Chat</h3>
            <div className="messages">
                {messages &&
                    messages.map((text) => (
                        <div key={text.id}>
                            <img
                                className="chatPic"
                                src={text.profile_pic_url || "/default.png"}
                            ></img>
                            <p>
                                {text.first} {text.last} on {text.timestamp}
                            </p>

                            <p>{text.text}</p>
                        </div>
                    ))}
            </div>
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
