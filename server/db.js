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

////GET user data////////////

module.exports.getUserData = (userId) => {
    const q = `SELECT * FROM users WHERE id=$1`;
    const params = [userId];
    return db.query(q, params);
};

////UPLOAD profile pic////////

module.exports.uploadImg = (userId, profilePicUrl) => {
    const q = `UPDATE users
    SET profile_pic_url= $2
    WHERE id=$1
    RETURNING profile_pic_url`;
    const params = [userId, profilePicUrl];
    return db.query(q, params);
};

////UPLOAD profile bio////////////

module.exports.editBio = (userId, bio) => {
    const q = `UPDATE users
    SET bio = $2
    WHERE id=$1
    RETURNING bio`;
    const params = [userId, bio];
    return db.query(q, params);
};

////FETCH 3 most recent users//////////

module.exports.fetchUsers = () => {
    const q = `SELECT * FROM users ORDER BY id DESC LIMIT 3;`;
    return db.query(q);
};

////SEARCH users///////////////////////

module.exports.searchUsers = (val) => {
    return db.query(`SELECT * FROM USERS WHERE first ILIKE $1;`, [val + "%"]);
};

////CHECK friendship///////////////////

module.exports.checkFriendship = (searchedUser, userId) => {
    const q = `SELECT * FROM friendships
    WHERE (recipient_id = $1 AND sender_id = $2)
    OR (recipient_id = $2 AND sender_id = $1)`;
    const params = [searchedUser, userId];
    return db.query(q, params);
};

////REQUEST friendship///////////////////

module.exports.requestFriendship = (searchedUser, userId) => {
    const q = `INSERT INTO friendships (recipient_id, sender_id)
    VALUES ($1, $2)`;
    const params = [searchedUser, userId];
    return db.query(q, params);
};

////CANCEL friendship///////////////////

module.exports.cancelFriendship = (searchedUser, userId) => {
    const q = `DELETE FROM friendships
    WHERE (recipient_id = $1 AND sender_id = $2)
    OR (recipient_id = $2 AND sender_id = $1)`;
    const params = [searchedUser, userId];
    return db.query(q, params);
};

////ACCEPT friendship////////////////////

module.exports.acceptFriendship = (searchedUser, userId) => {
    const q = `UPDATE friendships
    SET accepted = true
    WHERE (recipient_id = $1 AND sender_id = $2)
    OR (recipient_id = $2 AND sender_id = $1)`;
    const params = [searchedUser, userId];
    return db.query(q, params);
};

/////GET total friends////////////////////

module.exports.getFriends = (userId) => {
    const q = `SELECT users.id, first, last, profile_pic_url, accepted, sender_id, recipient_id
    FROM friendships
    JOIN users
    ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = false AND recipient_id = users.id AND sender_id = $1)
    OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)`;
    const params = [userId];
    return db.query(q, params);
};

////SELECT 10 last messages////////////////

module.exports.selectMessages = () => {
    const q = `SELECT messages.sender_id, messages.text, messages.timestamp, messages.id, users.first, last, profile_pic_url
    FROM messages
    JOIN users
    ON sender_id = users.id
    ORDER BY messages.timestamp DESC LIMIT 10 `;
    return db.query(q);
};

////ADD new message////////////////////////

module.exports.addMessage = (senderId, text) => {
    const q = `INSERT INTO messages (sender_id, text)
    VALUES ($1, $2) RETURNING *`;
    const params = [senderId, text];
    return db.query(q, params);
};
