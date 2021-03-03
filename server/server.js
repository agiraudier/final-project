const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const { sendEmail } = require("./ses");
const cryptoRandomString = require("crypto-random-string");
const csurf = require("csurf");
const { uploader } = require("./uploads");
const s3 = require("./s3");
const { s3Url } = require("./config.json");

const server = require("http").Server(app);

const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

let cookie_sec;

if (process.env.cookie_secret) {
    // we are in production
    cookie_sec = process.env.cookie_secret;
} else {
    cookie_sec = require("./secrets.json").sessionSecret;
}

app.use(compression());
app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(
    express.urlencoded({
        extended: false,
    })
);

/*app.use(
    cookieSession({
        secret: cookie_sec,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);*/

const cookieSessionMiddleware = cookieSession({
    secret: cookie_sec,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});

app.use(cookieSessionMiddleware);

io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.get("/welcome", (req, res) => {
    // if you don't have the cookie-session middelware this code will NOT work!
    if (req.session.userId) {
        // if the user is logged in... redirect away from /welcome
        res.redirect("/");
    } else {
        // user is not logged in... don't redirect!
        // what happens after sendfile, after we send our HTML back as a response,
        // is start.js
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/registration", (req, res) => {
    const firstName = req.body.first;
    const lastName = req.body.last;
    const email = req.body.email;
    const pw = req.body.password;

    if ((firstName, lastName, email, pw)) {
        hash(pw)
            .then((hashedPw) => {
                //console.log("hashedPw in /register:", hashedPw);
                db.addData(firstName, lastName, email, hashedPw)
                    //console.log("new data in register: ", firstName, lastName, email, hashedPw);
                    .then(({ rows }) => {
                        req.session.userId = rows[0].id;
                        res.json({ success: true, data: rows[0] });
                    })
                    .catch((err) => {
                        console.log("this is the rr in addData: ", err);
                        res.json({ success: false });
                    });
            })
            .catch((err) => console.log("err in hash:", err));
    } else {
        res.json({ success: false });
    }
});

app.get("/login", (req, res) => {
    if (!req.session.userId) {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    } else {
        res.redirect("/login");
    }
});

app.post("/login", (req, res) => {
    const email = req.body.email;
    const pw = req.body.password;

    if ((email, pw)) {
        db.getEmailData(email).then(({ rows }) => {
            let hashedPw = rows[0].password;

            compare(pw, hashedPw)
                .then((match) => {
                    if (match) {
                        req.session.userId = rows[0].id;
                        req.session.loggedIn = rows[0].id;
                        res.json({ success: true });
                    } else {
                        console.log("err in matching");
                        res.json({ success: false });
                    }
                })
                .catch((err) => {
                    console.log("err in comparation: ", err);
                    res.json({ success: false });
                });
        });
    } else {
        console.log("no input");
        res.json({ success: false });
    }
});

app.post("/password/reset/start", (req, res) => {
    const email = req.body.email;

    if (email) {
        db.getEmailData(email).then(({ rows }) => {
            let savedEmail = rows[0].email;
            const secretCode = cryptoRandomString({
                length: 6,
            });

            compare(email, savedEmail)
                .then(() => {
                    db.sendCode(email, secretCode)
                        .then(() => {
                            sendEmail(
                                email,
                                secretCode,
                                "Here is the code you need to reset your password."
                            );
                            res.json({ success: true });
                        })
                        .catch((err) => {
                            console.log("this is err sending email:", err);
                        });
                })
                .catch((err) => {
                    console.log("err in comparation, email: ", err);
                    res.json({ success: false });
                });
        });
    } else {
        console.log("no input");
        res.json({ success: false });
    }
});

app.post("/password/reset/verify", (req, res) => {
    const pw = req.body.password;
    const code = req.body.code;

    if ((pw, code)) {
        db.verifyCode(code).then(({ rows }) => {
            let savedEmail = rows[0].email;
            let correctCode = rows.find((row) => {
                return row.code === req.body.code;
            });

            if (correctCode) {
                hash(pw)
                    .then((hashedPw) => {
                        db.updatePw(savedEmail, hashedPw)
                            .then(() => {
                                res.json({ success: true });
                            })
                            .catch((err) => {
                                console.log(
                                    "this is err updating password:",
                                    err
                                );
                                res.json({ success: false });
                            });
                    })
                    .catch((err) => {
                        console.log("err in hashing: ", err);
                        res.json({ success: false });
                    });
            }
        });
    } else {
        console.log("no input");
        res.json({ success: false });
    }
});

app.get("/api/user", (req, res) => {
    //console.log("this is req session userid: ", req.session.userId);
    let id = req.session.userId;
    db.getUserData(id)
        .then(({ rows }) => {
            console.log("this rows[0]: ", rows[0]);
            res.json({ success: true, rows: rows[0] });
        })
        .catch((err) => {
            console.log("this is err getting user data: ", err);
            res.json({ success: false });
        });
});

app.post("/profilePic", uploader.single("file"), s3.upload, (req, res) => {
    const { filename } = req.file;
    const url = `${s3Url}${filename}`;
    const id = req.session.userId;

    if (req.file) {
        db.uploadImg(id, url)
            .then(({ rows }) => {
                //console.log("rows[0] profile pic: ", rows[0].profile_pic_url);
                res.json({ success: true, data: rows[0].profile_pic_url });
            })
            .catch((err) => {
                console.log("this is the err in upload profile pic: ", err);
                res.json({ success: false });
            });
    } else {
        console.log("no input");
        res.json({ success: false });
    }
});

app.post("/bio", (req, res) => {
    let id = req.session.userId;
    const bio = req.body.bio;

    db.editBio(id, bio)
        .then(({ rows }) => {
            //console.log("rows[0] bio: ", rows[0].bio);
            res.json({ success: true, data: rows[0].bio });
        })
        .catch((err) => {
            console.log("this is the err in uploading bio: ", err);
            res.json({ success: false });
        });
});

app.get("/api/otherProfile/:id", (req, res) => {
    //console.log("req session userId: ", req.session.userId);
    //console.log("req params id: ", req.params.id);
    const id = req.params.id;
    db.getUserData(id)
        .then(({ rows }) => {
            //console.log("this rows[0] otherProfile: ", rows[0]);
            res.json({
                success: true,
                rows: rows[0],
                cookie: req.session.userId,
            });
        })
        .catch((err) => {
            console.log("this is err getting user data: ", err);
            res.json({ success: false });
        });
});

app.get("/api/find/:val?", (req, res) => {
    //console.log("req.params: ", req.params);
    let val = req.params.val;
    if (!val) {
        db.fetchUsers()
            .then(({ rows }) => {
                //console.log("rows in find users: ", rows);
                res.json({ success: true, rows: rows });
            })
            .catch((err) => {
                console.log("this is the err in fetchUsers: ", err);
                res.json({ success: false });
            });
    } else {
        db.searchUsers(val)
            .then(({ rows }) => {
                res.json({ success: true, rows: rows });
            })
            .catch((err) => {
                console.log("this is the err in searchUsers: ", err);
                res.json({ success: false });
            });
    }
});

app.get("/api/friends/:id", (req, res) => {
    //console.log("req.params.id: ", req.params.id);
    const searchedUser = req.params.id;
    const user = req.session.userId;

    db.checkFriendship(searchedUser, user)
        .then(({ rows }) => {
            if (!rows.length) {
                res.json({
                    button: "Request friendship",
                });
            } else if (rows[0].accepted) {
                res.json({
                    button: "Cancel friendship",
                });
            } else if (!rows[0].accepted) {
                if (rows[0].recipient_id == user) {
                    res.json({
                        button: "Accept friendship",
                    });
                } else if (rows[0].sender_id == user) {
                    res.json({
                        button: "Cancel friendship request",
                    });
                }
            }
        })
        .catch((err) => {
            console.log("this is the err in checkFriendship: ", err);
            res.json({ success: false });
        });
});

app.post("/api/friends/:id", (req, res) => {
    const searchedUser = req.params.id;
    const user = req.session.userId;
    const button = req.body.button;

    if (button == "Request friendship") {
        db.requestFriendship(searchedUser, user)
            .then(({ rows }) => {
                res.json({ button: "Cancel friendship request", rows: rows });
            })
            .catch((err) => {
                console.log("this is the err in requestFriendship: ", err);
                res.json({ success: false });
            });
    } else if (button == "Cancel friendship") {
        db.cancelFriendship(searchedUser, user)
            .then(({ rows }) => {
                res.json({ button: "Request friendship", rows: rows });
            })
            .catch((err) => {
                console.log("this is the err in cancelFriendship: ", err);
                res.json({ success: false });
            });
    } else if (button == "Accept friendship") {
        db.acceptFriendship(searchedUser, user)
            .then(({ rows }) => {
                res.json({ button: "Cancel friendship", rows: rows });
            })
            .catch((err) => {
                console.log("this is the err in acceptFriendship: ", err);
                res.json({ success: false });
            });
    } else if (button == "Cancel friendship request") {
        db.cancelFriendship(searchedUser, user)
            .then(({ rows }) => {
                res.json({ button: "Request friendship", rows: rows });
            })
            .catch((err) => {
                console.log(
                    "this is the err in cancelFriendship/request: ",
                    err
                );
                res.json({ success: false });
            });
    }
});

app.get("/get-friends", (req, res) => {
    const user = req.session.userId;

    db.getFriends(user)
        .then(({ rows }) => {
            console.log("rows get friends: ", rows);
            res.json({ success: true, rows: rows, userId: user });
        })
        .catch((err) => {
            console.log("this is the err in getFriends: ", err);
            res.json({ success: false });
        });
});

app.post("/canvas", (req, res) => {
    const id = req.session.userId;
    const url = req.body.url;
    const title = req.body.title;

    //console.log("req.body", req.body);
    console.log(id);

    db.uploadCanvas(id, url, "canvas", title)
        .then(({ rows }) => {
            //console.log("rows[0] canvas drawing: ", rows[0].url);
            res.json({ success: true, data: rows[0].url });
        })
        .catch((err) => {
            console.log("this is the err in uploadCanvas: ", err);
            res.json({ success: false });
        });
    /* } else {
        console.log("no input in canvas or canvas title");
        res.json({ success: false });
    }*/
});

app.get("/feed", (req, res) => {
    db.getTotalMedia()
        .then(({ rows }) => {
            //console.log("rows in getTotalMedia: ", rows);
            res.json({ success: true, rows: rows });
        })
        .catch((err) => {
            console.log("this is the err in getTotalMedia: ", err);
            res.json({ success: false });
        });
});

app.post("/feed", uploader.single("file"), s3.upload, (req, res) => {
    const id = req.session.userId;
    const { filename } = req.file;
    const url = `${s3Url}${filename}`;
    const title = req.body.title;

    if (req.file) {
        db.uploadMedia(id, url, "media", title)
            .then(({ rows }) => {
                //console.log("rows in uploadMedia: ", rows);
                res.json({ success: true, data: rows[0] });
            })
            .catch((err) => {
                console.log("this is the err in uploadMedia: ", err);
                res.json({ success: false });
            });
    }
});

app.get("/images", (req, res) => {
    const id = req.session.userId;

    db.getParticularMedia(id)
        .then(({ rows }) => {
            //console.log("rows in getParticularMedia: ", rows);
            res.json({ success: true, rows: rows });
        })
        .catch((err) => {
            console.log("this is the err in getParticularMedia: ", err);
            res.json({ success: false });
        });
});

app.get("/imagesOthers/:id", (req, res) => {
    const id = req.params.id;

    db.getParticularMedia(id)
        .then(({ rows }) => {
            console.log("rows in getParticularMedia otherprofile: ", rows);
            res.json({ success: true, rows: rows });
        })
        .catch((err) => {
            console.log(
                "this is the err in getParticularMedia otherprofile: ",
                err
            );
            res.json({ success: false });
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome");
});

//DONT MOVE THIS ROUTE///////////////////////////////////////////////
app.get("*", (req, res) => {
    if (!req.session.userId) {
        // if the user is not logged in, redirect to /welcome
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

/*app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});*/

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

io.on("connect", async function (socket) {
    const userId = socket.request.session.userId;

    if (!userId) {
        return socket.disconnect(true);
    }

    try {
        const { rows } = await db.selectMessages();
        //console.log("rows in chatMessages: ", rows);
        socket.emit("chatMessages", rows.reverse());
    } catch (err) {
        console.log("this is the err in selectMessages: ", err);
    }

    socket.on("messages", async (data) => {
        console.log("message: ", data);
        try {
            const message = await db.addMessage(userId, data);

            console.log("rows in message: ", message.rows[0]);
            io.emit("messages", message.rows[0]);
        } catch (err) {
            console.log("this is the err in addMessage: ", err);
        }
    });

    socket.on("disconnect", () => {
        console.log(`Socket with id: ${socket.id} just DISCONNECTED`);
        return socket.disconnect(true);
    });
});
