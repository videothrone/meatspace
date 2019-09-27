import React from "react";
import { useSelector } from "react-redux";

export function UsersOnline(props) {
    const onlineUsers = useSelector(state => state && state.onlineUsersArray);

    return (
        <React.Fragment>
            <div id="overlay-online-users">
                <div id="overlay-border">
                    <div onClick={props.hideOUModal}>
                        <div className="x">X</div>
                    </div>
                    <h1>Online Users</h1>
                    {onlineUsers &&
                        onlineUsers.map((user, index) => {
                            return (
                                <div key={index}>
                                    <img
                                        src={
                                            user.imageurl || "/img/default.png"
                                        }
                                    />
                                    <br />
                                    {user.first} {user.last}
                                </div>
                            );
                        })}
                </div>
            </div>
        </React.Fragment>
    );
}
