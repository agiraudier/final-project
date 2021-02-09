const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const cookieSession = require("cookie-session");
const { hash } = require("./bc");

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
    cookieSession({
        secret: cookie_sec,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

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

app.post("/register", (req, res) => {
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

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
