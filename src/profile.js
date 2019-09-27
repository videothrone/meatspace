import React from "react";
import { ProfilePic } from "./profilepic";
import { BioEditor } from "./bioeditor";

export default function Profile({
    first,
    last,
    imageurl,
    bio,
    setBio,
    showModal
}) {
    return (
        <div>
            <div id="profile-container">
                <h1>
                    {first} {last}
                </h1>
                <div id="profile-img">
                    <ProfilePic
                        first={first}
                        last={last}
                        imageurl={imageurl}
                        showModal={showModal}
                    />
                </div>
                <BioEditor bio={bio} setBio={setBio} />
            </div>
        </div>
    );
}
