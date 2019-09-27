export default function reducer(state = {}, action) {
    if (action.type === "RECEIVE_FRIENDS_WANNABES") {
        state = {
            ...state,
            friendsWannabes: action.friendsWannabes
        };
    }
    if (action.type === "ACCEPT_FRIEND_REQUEST") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map(friendsWannabes => {
                if (friendsWannabes.id === action.id) {
                    return {
                        ...friendsWannabes,
                        accepted: true
                    };
                } else {
                    return friendsWannabes;
                }
            })
        };
    }
    if (action.type === "UNFRIEND") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.filter(friendsWannabes => {
                return friendsWannabes.id != action.id;
            })
        };
    }
    if (action.type === "RECEIVE_LAST_CHAT_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.chatMessages
        };
    }
    if (action.type === "ADD_CHAT_MESSAGES") {
        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.chatMessage]
        };
    }
    if (action.type === "ONLINE_USERS_ARRAY") {
        state = {
            ...state,
            onlineUsersArray: action.onlineUsersArray
        };
    }
    return state;
}
