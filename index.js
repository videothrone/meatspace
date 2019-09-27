const express = require("express");
const app = express();
const ca = require("chalk-animation");
const db = require("./utils/db");
const { hash, compare } = require("./utils/bc");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const s3 = require("./s3");
const config = require("./config");
const compression = require("compression");
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
const moment = require("moment");

/// FILE UPLOAD BOILERPLATE ///
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

/// FILE UPLOAD BOILERPLATE END ///

app.use(compression());
app.use(express.static("./public"));
app.use(express.json());

// cookie session setup
const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.post("/registration", (req, res) => {
    let first = req.body.first;
    let last = req.body.last;
    let email = req.body.email;
    let password = req.body.password;
    // first = first.toLowerCase();
    // first = first.charAt(0).toUpperCase() + first.substring(1);
    // last = last.toLowerCase();
    // last = last.charAt(0).toUpperCase() + last.substring(1);

    hash(password)
        .then(hash => {
            db.addUsers(first, last, email, hash)
                .then(data => {
                    req.session.userId = data.rows[0].id;
                    console.log("data.rows[0].id", data.rows[0].id);
                    res.json({ success: true });
                })
                .catch(error => {
                    console.log("db.addUsers error: ", error);
                    res.json({ success: false });
                });
        })
        .catch(error => {
            console.log("hash(password) error: ", error);
            res.json({ success: false });
        });
});

app.post("/login", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    db.getLogin(email)
        .then(results => {
            compare(password, results.rows[0].password)
                .then(compResult => {
                    if (compResult) {
                        req.session.userId = results.rows[0].id;
                        res.json({ success: true });
                    } else {
                        res.json({ success: false });
                    }
                })
                .catch(error => {
                    console.log("db.getLogin compare error: ", error);
                    res.json({ success: false });
                });
        })
        .catch(error => {
            console.log("db.getLogin catch error: ", error);
            res.json({ success: false });
        });
});

app.get("/users", (req, res) => {
    db.getUser(req.session.userId)
        .then(response => {
            res.json(response);
        })
        .catch(error => {
            console.log("error from app.get /users: ", error);
        });
});

app.get("/api/user/:id", (req, res) => {
    db.getUser(req.params.id)
        .then(response => {
            if (req.session.userId == req.params.id) {
                res.json();
            } else {
                res.json(response);
            }
        })
        .catch(error => {
            console.log("error from app.get api/users/:id: ", error);
        });
});

app.get("/findpeople", (req, res) => {
    db.getNewestUsers(req.session.userId)
        .then(response => {
            res.json(response);
        })
        .catch(error => {
            console.log("error from app.get /findpeople: ", error);
        });
});

app.get("/matchingusers/", (req, res) => {
    db.getMatchingUsers(req.query.q)
        .then(response => {
            res.json(response);
        })
        .catch(error => {
            console.log("error from app.get /matchingusers/: ", error);
        });
});

app.get("/friendstatus/:id", (req, res) => {
    db.getFriendStatus(req.params.id, req.session.userId)
        .then(response => {
            console.log(response);
            res.json({
                response: response.rows[0],
                userId: req.session.userId
            });
        })
        .catch(error => {
            console.log("error from app.get /friendstatus/: ", error);
        });
});

app.post("/friendrequest/:id", (req, res) => {
    db.makeFriendRequest(req.params.id, req.session.userId)
        .then(response => {
            res.json(response);
        })
        .catch(error => {
            console.log("error from app.get /friendstatus/: ", error);
        });
});

app.post("/acceptrequest/:id", (req, res) => {
    db.acceptFriendRequest(req.params.id, req.session.userId)
        .then(() => {
            res.json({ success: true });
        })
        .catch(error => {
            console.log("error from app.get /acceptrequest/: ", error);
        });
});

app.post("/cancelrequest/:id", (req, res) => {
    db.cancelOrDeleteFriend(req.params.id, req.session.userId)
        .then(response => {
            console.log("app.post(/cancelrequest", response);
            res.json(response);
        })
        .catch(error => {
            console.log("error from app.get /cancelrequest/: ", error);
        });
});

app.get("/friends-wannabes", (req, res) => {
    db.friendsAndWannabes(req.session.userId)
        .then(response => {
            res.json(response.rows);
        })
        .catch(error => {
            console.log("error from app.get /friends-wannabes: ", error);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const { filename } = req.file;
    console.log("config.s3Url + filename", config.s3Url + filename);
    const imageurl = config.s3Url + filename;
    console.log("imageurl, req.session.userId", imageurl, req.session.userId);
    if (req.file) {
        db.addProfilePic(imageurl, req.session.userId)
            .then(function(data) {
                console.log("data.rows[0]", data.rows[0]);
                res.json({ imageurl: data.rows[0].imageurl });
            })
            .catch(function(error) {
                console.log("error in app.post /upload: ", error);
            });
    } else {
        res.json({
            success: false
        });
    }
});

app.post("/bio", (req, res) => {
    db.addBio(req.body.bio, req.session.userId)
        .then(function(data) {
            res.json(data);
        })
        .catch(function(error) {
            console.log("error in app.post /bio: ", error);
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome");
});

app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

const onlineUsers = {};
let onlineUsersArray = [];

io.on("connection", function(socket) {
    // console.log(`socket with the id ${socket.id} is connected`);
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }
    const userId = socket.request.session.userId;

    socket.on("My amazing chat message", msg => {
        let addChatMessage = db.addChatMessage(userId, msg);
        // .then(data => {
        //     // console.log("addChatMessage data.rows", data.rows);
        //     io.sockets.emit("addChatMessage", data.rows[0]);
        // })
        // .catch(function(error) {
        //     console.log(
        //         "error in socket.on My amazing chat message: ",
        //         error
        //     );
        // });
        let getUserChat = db.getUserChat(userId);

        Promise.all([addChatMessage, getUserChat])
            .then(arrayOfObjects => {
                let concatArray = [
                    ...arrayOfObjects[0].rows,
                    ...arrayOfObjects[1].rows
                ];

                let concatObj = {
                    ...concatArray[0],
                    ...concatArray[1]
                };

                concatObj.created_at = moment(concatObj.created_at).fromNow();
                io.sockets.emit("addChatMessage", concatObj);
            })
            .catch(function(error) {
                console.log("error in Promise.all: ", error);
            });
    });

    db.getLastTenChatMessages().then(data => {
        // console.log("getChatMessages data.rows", data.rows);
        data.rows.map(item => {
            item.created_at = moment(item.created_at).fromNow();
        });
        io.sockets.emit("getChatMessages", data.rows.reverse());
    });

    onlineUsers[socket.id] = userId;
    Object.values(onlineUsers);

    db.getOnlineUsers(userId).then(onlineUsers => {
        onlineUsersArray.push(onlineUsers);
        io.sockets.emit("onlineUsersArray", onlineUsersArray);
    });

    socket.on("disconnect", () => {
        delete onlineUsers[socket.id];
        // onlineUsersArray = [];
        // console.log(`socket with the id ${socket.id} is disconnected`);
    });
});

server.listen(8080, function() {
    ca.rainbow("ʕ•ᴥ•ʔ Social Network Express is running...");
});
