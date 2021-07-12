CREATE TABLE users (
    id                SERIAL PRIMARY KEY,
    first_name        VARCHAR(50) NOT NULL,
    last_name         VARCHAR(50) NOT NULL,
    username          VARCHAR(50) NOT NULL, --Do we ant to make it unique?
    password          TEXT NOT NULL,
    email             TEXT NOT NULL UNIQUE CHECK (POSITION('@' IN email) > 1),
    profile_picture   TEXT,
    date_of_birth     TIMESTAMP,
    goal              INTEGER,
    genre_interest    TEXT[],
    created_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ratings_and_reviews (
    id                SERIAL PRIMARY KEY,
    rating            INTEGER NOT NULL,
    review_body       TEXT,
    user_id           INTEGER REFERENCES users(id) ON DELETE CASCADE,
    book_id           TEXT NOT NULL,
    created_at        TIMESTAMP DEFAULT NOW(), 
    updated_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reviews_replies (
    id                SERIAL PRIMARY KEY,
    rating_id         INTEGER REFERENCES ratings_and_reviews(id) ON DELETE CASCADE,
    reply_body        TEXT NOT NULL,
    created_at        TIMESTAMP DEFAULT NOW(), 
    updated_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE lists (
    id                SERIAL PRIMARY KEY,
    list_name         VARCHAR(50) NOT NULL,
    user_id           INTEGER REFERENCES users(id) ON DELETE CASCADE,
    image             TEXT,
    reply_body        TEXT NOT NULL,
    created_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE list_contents (
    id                SERIAL PRIMARY KEY,
    list_id           INTEGER REFERENCES lists(id) ON DELETE CASCADE,
    book_id           TEXT NOT NULL,
    added_on          TIMESTAMP DEFAULT NOW()
);

CREATE TABLE liked_authors (
    id                SERIAL PRIMARY KEY,
    author_id         TEXT NOT NULL,
    user_id           INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE forums (
    id                SERIAL PRIMARY KEY,
    title             TEXT NOT NULL,
    description       TEXT NOT NULL,
    user_id           INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at        TIMESTAMP DEFAULT NOW()

);


CREATE TABLE posts (
    id                SERIAL PRIMARY KEY,
    forum_id          INTEGER REFERENCES forums(id) ON DELETE CASCADE,
    post              TEXT NOT NULL,
    user_id           INTEGER REFERENCES users(id) ON DELETE CASCADE,
    vote              INTEGER,
    created_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE forums_replies (
    id                SERIAL PRIMARY KEY,
    post_id           INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    reply_body        TEXT NOT NULL,
    user_id           INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at        TIMESTAMP DEFAULT NOW()
);
