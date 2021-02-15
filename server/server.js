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

app.use(
    cookieSession({
        secret: cookie_sec,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

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

app.get("*", (req, res) => {
    if (!req.session.userId) {
        // if the user is not logged in, redirect to /welcome
        res.redirect("/welcome");
    } else {
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

app.post("/login", (req, res) => {
    const email = req.body.email;
    const pw = req.body.password;

    if ((email, pw)) {
        db.getEmailData(email).then(({ rows }) => {
            let hashedPw = rows[0].password;

            compare(pw, hashedPw)
                .then(() => {
                    req.session.userId = rows[0].id;
                    res.json({ success: true });
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

app.get("/user", (req, res) => {
    const id = req.session.userId;
    db.getUserData(id)
        .then(({ rows }) => {
            res.json({ success: true, data: rows[0] });
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
                //console.log("rows[0] profile pic: ", rows[0].profile_pic_url)
                res.json({ success: true, rows: rows[0].profile_pic_url });
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

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
