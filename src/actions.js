//action creator functions MUST return objects
import axios from "./axios";

export function receiveFriendsWannabes() {
    return axios.get("/friends-wannabes").then(({ data }) => {
        return {
            type: "RECEIVE_FRIENDS_WANNABES",
            friendsWannabes: data
        };
    });
}

export function acceptFriendRequest(id) {
    return axios.post("/acceptrequest/" + id).then(({ data }) => {
        // console.log("acceptFriendRequest(id) data", data);
        return {
            type: "ACCEPT_FRIEND_REQUEST",
            friendsWannabes: data
        };
    });
}

export function unfriend(id) {
    return axios.post("/cancelrequest/" + id).then(({ data }) => {
        return {
            type: "UNFRIEND",
            friendsWannabes: data
        };
    });
}

export function getChatMessages(msgs) {
    // console.log("getChatMessages action.js: ", msgs);
    return {
        type: "RECEIVE_LAST_CHAT_MESSAGES",
        chatMessages: msgs
    };
}

export function addChatMessage(msg) {
    console.log("addChatMessage action.js: ", msg);
    return {
        type: "ADD_CHAT_MESSAGES",
        chatMessage: msg
    };
}

export function onlineUsersArray(users) {
    var merged = [].concat.apply([], users);
    const mappedUsers = Array.from(new Set(merged.map(a => a.id))).map(id => {
        return merged.find(a => a.id === id);
    });

    console.log("merged: ", merged);
    console.log("mappedUsers: ", mappedUsers);
    return {
        type: "ONLINE_USERS_ARRAY",
        onlineUsersArray: mappedUsers
    };
}
