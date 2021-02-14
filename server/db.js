const spicedPg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    // this means we are in production on heroku
    db = spicedPg(process.env.DATABASE_URL);
} else {
    // we are running locally
    // CAFREFUL your secrets require statement might look different
    const { userName, userPassword } = require("./secrets.json");
    db = spicedPg(`postgres:${userName}:${userPassword}@localhost:5432/users`);
}

////Registers data//////////

module.exports.addData = (first, last, email, hashedPw) => {
    const q = `INSERT INTO users (first, last, email, password)
    VALUES ($1, $2, $3, $4) RETURNING id`;

    const params = [first, last, email, hashedPw];
    return db.query(q, params);
};

////COMPARE with registered data/////////

module.exports.getEmailData = (email) => {
    const q = `SELECT * FROM users WHERE email = $1`;
    const params = [email];
    return db.query(q, params);
};

////SEND code to saved user/////////

module.exports.sendCode = (email, code) => {
    const q = `INSERT INTO reset_codes (email, code)
    VALUES ($1, $2) RETURNING *`;
    const params = [email, code];
    return db.query(q, params);
};

////VERIFY code to saved user/////////

module.exports.verifyCode = () => {
    const q = `SELECT * FROM reset_codes
    WHERE CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes'`;
    return db.query(q);
};

////UPDATE password//////////

module.exports.updatePw = (email, hashedPw) => {
    const q = `UPDATE users
    SET password = $2
    WHERE email= $1`;
    const params = [email, hashedPw];
    return db.query(q, params);
};
