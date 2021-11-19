CREATE TABLE accounts (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_identifier VARCHAR(30) UNIQUE,
    "user_name" VARCHAR(20) NOT NULL UNIQUE,
    user_pass VARCHAR(20) NOT NULL,
    modified TIMESTAMP NOT NULL DEFAULT now()
);