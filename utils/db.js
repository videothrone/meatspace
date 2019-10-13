const spicedPg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbuser, dbpass } = require("../secrets");
    db = spicedPg(`postgres:${dbuser}:${dbpass}@localhost:5432/socialnetwork`);
}

exports.addUsers = function(first, last, email, password) {
    return db.query(
        `INSERT INTO users (first, last, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING id`,
        [first || null, last || null, email || null, password || null]
    );
};

exports.getLogin = email => {
    return db.query(`SELECT id, password FROM users WHERE email = $1`, [email]);
};

exports.addProfilePic = function(imageurl, id) {
    return db.query(
        `UPDATE users
        SET imageurl= $1
        WHERE id = $2
        RETURNING imageurl`,
        [imageurl, id]
    );
};

exports.getUser = function(id) {
    return db.query(
        `SELECT first, last, imageurl, bio
        FROM users
        WHERE id = $1`,
        [id]
    );
};

exports.addBio = function(bio, id) {
    return db.query(
        `UPDATE users
        SET bio= $1
        WHERE id = $2
        RETURNING bio`,
        [bio, id]
    );
};

exports.getNewestUsers = function() {
    return db.query(
        `SELECT id, first, last, imageurl
        FROM users
        ORDER BY id DESC
        LIMIT 10`
    );
};

exports.getMatchingUsers = function(val) {
    return db.query(
        `SELECT id, first, last, imageurl
                    FROM users
                    WHERE first
                    ILIKE $1
                    ORDER BY id ASC;`,
        [val + "%"]
    );
};

exports.getFriendStatus = function(receiverId, senderId) {
    return db.query(
        `SELECT * FROM friendships
        WHERE (receiver_id = $1 AND sender_id=$2)
        OR (receiver_id = $2 AND sender_id=$1)`,
        [receiverId, senderId]
    );
};

exports.makeFriendRequest = function(receiverId, senderId) {
    return db.query(
        `INSERT INTO friendships (receiver_id, sender_id)
        VALUES ($1, $2)
        RETURNING accepted`,
        [receiverId, senderId]
    );
};

exports.acceptFriendRequest = function(receiverId, senderId) {
    return db.query(
        `UPDATE friendships
        SET accepted = true
        WHERE (receiver_id = $1 AND sender_id=$2)
        OR (receiver_id = $2 AND sender_id=$1)`,
        [receiverId, senderId]
    );
};

exports.cancelOrDeleteFriend = function(receiverId, senderId) {
    return db.query(
        `DELETE FROM friendships
        WHERE (receiver_id = $1 AND sender_id=$2)
        OR (receiver_id = $2 AND sender_id=$1)`,
        [receiverId, senderId]
    );
};

exports.friendsAndWannabes = function(userId) {
    return db.query(
        `SELECT users.id, first, last, imageurl, accepted
        FROM friendships
        JOIN users
        ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)`,
        [userId]
    );
};

exports.getLastTenChatMessages = function() {
    return db.query(
        `SELECT chats.id AS chats_id, sender_id, message, chats.created_at, first, last, imageurl
        FROM chats
        JOIN users
        ON sender_id = users.id
        ORDER BY created_at DESC
        LIMIT 10`
    );
};

exports.addChatMessage = function(sender_id, message) {
    return db.query(
        `INSERT INTO chats (sender_id, message)
    VALUES ($1, $2)
    RETURNING id AS chats_id, sender_id, message, created_at`,
        [sender_id, message]
    );
};

exports.getUserChat = function(id) {
    return db.query(
        `SELECT first, last, imageurl, id AS users_id
        FROM users
        WHERE id = $1`,
        [id]
    );
};

exports.getOnlineUsers = function(id) {
    return db
        .query(`SELECT * FROM users WHERE id=$1`, [id])
        .then(({ rows }) => {
            return rows;
        });
};
