CREATE TABLE events (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    active BOOLEAN NOT NULL,
    event_name TEXT NOT NULL,
    events_creator_id VARCHAR(30)
        REFERENCES accounts(user_identifier) ON DELETE CASCADE NOT NULL,
    "event_date" DATE NOT NULL,
    modified TIMESTAMP NOT NULL DEFAULT now()
);
