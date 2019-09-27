import React from "react";

export function ProfilePic({ imageurl, first, showModal }) {
    // this.state = { imageurl: "" };
    //if(!id) {
    //  return null;
    // }
    // console.log("imageurl:", imageurl);
    imageurl = imageurl || "/img/default.png";
    return (
        <div>
            <div id="profilepic-img">
                <img onClick={showModal} src={imageurl} title={first} />
            </div>
        </div>
    );
}
