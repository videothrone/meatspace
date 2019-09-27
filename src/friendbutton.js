import React, { useState, useEffect } from "react";
import axios from "./axios";

export function FriendButton(props) {
    const [buttonText, setButtonText] = useState();

    useEffect(() => {
        axios
            .get("/friendstatus/" + props.match)
            .then(({ data }) => {
                // console.log("data:", data);
                if (
                    data === "" ||
                    data.response === undefined ||
                    data.response.accepted === undefined
                ) {
                    setButtonText("Make Friend Request");
                } else if (data.response.accepted === true) {
                    setButtonText("Unfriend");
                } else if (
                    data.response.receiver_id === data.userId &&
                    data.response.accepted === false
                ) {
                    setButtonText("Accept Friend Request");
                } else {
                    setButtonText("Cancel Friend Request");
                }
            })
            .catch(function(error) {
                console.log("error in axios.get /friendstatus/: ", error);
            });
    }, []);

    function handleClick(e) {
        e.preventDefault();
        if (buttonText === "Make Friend Request") {
            axios
                .post("/friendrequest/" + props.match)
                .then(() => {
                    setButtonText("Cancel Friend Request");
                })
                .catch(function(error) {
                    console.log("error in axios.post /friendrequest: ", error);
                });
        } else if (
            buttonText === "Cancel Friend Request" ||
            buttonText === "Unfriend"
        ) {
            axios
                .post("/cancelrequest/" + props.match)
                .then(() => {
                    // if(sender_id === userId)
                    setButtonText("Make Friend Request");
                })
                .catch(function(error) {
                    console.log("error in axios.post /friendrequest: ", error);
                });
        } else if (buttonText === "Accept Friend Request") {
            axios
                .post("/acceptrequest/" + props.match)
                .then(() => {
                    setButtonText("Unfriend");
                })
                .catch(function(error) {
                    console.log("error in axios.post /acceptrequest: ", error);
                });
        }
    }

    return (
        <div>
            <button id="submit-friend" onClick={handleClick}>
                {buttonText}
            </button>
        </div>
    );
}
