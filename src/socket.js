import * as io from "socket.io-client";
import { getChatMessages, addChatMessage, onlineUsersArray } from "./actions";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        // socket.on("Message from server:", msg => {
        //     console.log(`Got message from frontend, my message ${msg}`);
        // });
        socket.on("getChatMessages", msgs => {
            // console.log(`Got messages in socket.js: ${JSON.stringify(msgs)}`);
            store.dispatch(getChatMessages(msgs));
        });
        socket.on("addChatMessage", msg => store.dispatch(addChatMessage(msg)));
        socket.on("onlineUsersArray", users =>
            store.dispatch(onlineUsersArray(users))
        );
    }
};
