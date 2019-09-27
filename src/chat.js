import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export function Chat() {
    const chatMessages = useSelector(state => state && state.chatMessages);
    console.log("the last chat messages in chat.js: ", chatMessages);

    const keyCheck = e => {
        // console.log("e.key", e.key);
        if (e.key === "Enter") {
            e.preventDefault();
            // console.log(e.target.value);
            socket.emit("My amazing chat message", e.target.value);
            e.target.value = "";
        }
    };

    const elemRef = useRef();

    useEffect(() => {
        // console.log("elemRef: ", elemRef.current);
        // console.log("Scroll top", elemRef.current.scrollTop);
        // console.log("Scroll height: ", elemRef.current.scrollHeight);
        // console.log("Client height:", elemRef.current.clientHeight);
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [chatMessages]);

    return (
        <React.Fragment>
            <div id="chat-box" className="left-margin">
                <div id="chat-room">
                    <h1>Chat Room</h1>
                </div>
                <div className="chat-messages" ref={elemRef}>
                    {chatMessages &&
                        chatMessages.map((message, index) => {
                            return (
                                <div
                                    key={index}
                                    id="chat-img"
                                    className="left-margin"
                                >
                                    <img
                                        src={
                                            message.imageurl ||
                                            "/img/default.png"
                                        }
                                    />
                                    {message.first} {message.last}:{" "}
                                    <div id="chat-message">
                                        &quot;{message.message}
                                        &quot;
                                    </div>
                                    <div className="time-format">
                                        <p>{message.created_at}</p>
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <textarea
                    placeholder="Add your message here"
                    onKeyDown={keyCheck}
                    rows="5"
                    cols="50"
                    id="textarea-chat"
                />
            </div>
        </React.Fragment>
    );
}
