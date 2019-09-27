import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    receiveFriendsWannabes,
    acceptFriendRequest,
    unfriend
} from "./actions";
import { Link } from "react-router-dom";

export default function FriendsWannabes() {
    const dispatch = useDispatch();
    const friends = useSelector(
        state =>
            state.friendsWannabes &&
            state.friendsWannabes.filter(friend => friend.accepted === true)
    );
    const wannabes = useSelector(
        state =>
            state.friendsWannabes &&
            state.friendsWannabes.filter(friend => friend.accepted === false)
    );

    useEffect(() => {
        dispatch(receiveFriendsWannabes());
    }, [friends, wannabes]);

    return (
        <div>
            <div id="findpeople">
                <h1>Friends and Wannabes</h1>
                {friends && friends.length > 0 && <h2>Friends</h2>}
                {friends && friends.length == 0 && (
                    <h3>You haven&apos;t made friends yet. ¯\_(ツ)_/¯</h3>
                )}
                <div id="friends-wanabees">
                    <div id="friends">
                        {friends &&
                            friends.map((friend, index) => {
                                return (
                                    <div key={index} id="friends-img">
                                        <div className="user-block">
                                            <Link to={"/user/" + friend.id}>
                                                <img
                                                    src={
                                                        friend.imageurl ||
                                                        "/img/default.png"
                                                    }
                                                />
                                                <p>
                                                    {friend.first} {friend.last}
                                                </p>
                                            </Link>
                                        </div>
                                        <button
                                            onClick={() =>
                                                dispatch(unfriend(friend.id))
                                            }
                                            id="edit-save"
                                        >
                                            Unfriend
                                        </button>
                                    </div>
                                );
                            })}
                    </div>
                    <div id="wanabees">
                        {wannabes && wannabes.length > 0 && <h2>Wannabes</h2>}
                        {wannabes &&
                            wannabes.map((wannabe, index) => {
                                return (
                                    <div key={index} id="friends-img">
                                        <Link to={"/user/" + wannabe.id}>
                                            <img
                                                src={
                                                    wannabe.imageurl ||
                                                    "/img/default.png"
                                                }
                                            />
                                            <p>
                                                {wannabe.first} {wannabe.last}
                                            </p>
                                        </Link>
                                        <button
                                            onClick={() =>
                                                dispatch(
                                                    acceptFriendRequest(
                                                        wannabe.id
                                                    )
                                                )
                                            }
                                            id="edit-save"
                                        >
                                            Accept
                                        </button>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
}
