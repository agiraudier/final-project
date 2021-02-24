DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS reset_codes;
DROP TABLE IF EXISTS friendships;

CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      first VARCHAR(255) NOT NULL,
      last VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      profile_pic_url VARCHAR(255) DEFAULT NULL,
      bio VARCHAR(255) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

CREATE TABLE reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,
    code VARCHAR NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friendships(
id SERIAL PRIMARY KEY,
sender_id INT REFERENCES users(id) NOT NULL,
recipient_id INT REFERENCES users(id) NOT NULL,
accepted BOOLEAN DEFAULT false
);

CREATE TABLE messages(
id SERIAL PRIMARY KEY,
sender_id INT REFERENCES users(id) NOT NULL,
text VARCHAR NOT NULL, 
timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);