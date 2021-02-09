const spicedPg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    // this means we are in production on heroku
    db = spicedPg(process.env.DATABASE_URL);
} else {
    // we are running locally
    // CAFREFUL your secrets require statement might look different
    const { userName, userPassword } = require("./secrets.json");
    db = spicedPg(
        `postgres:${userName}:${userPassword}@localhost:5432/network`
    );
}

module.exports.addData = (first, last, email, hashedPw) => {
    const q = `INSERT INTO users (first, last, email, password)
    VALUES ($1, $2, $3, $4) RETURNING id`;

    const params = [first, last, email, hashedPw];
    return db.query(q, params);
};
