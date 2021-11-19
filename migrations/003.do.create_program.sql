CREATE TABLE program (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  program_events_id INTEGER
    REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  call_desc TEXT NOT NULL,
  call_leader TEXT NOT NULL,
  call_passage TEXT NOT NULL,
  song_desc TEXT NOT NULL,
  song_leader TEXT NOT NULL,
  confession_desc TEXT NOT NULL,
  confession_leader TEXT NOT NULL,
  sermon_desc TEXT NOT NULL,
  sermon_series TEXT NOT NULL,
  sermon_title TEXT NOT NULL,
  sermon_speaker TEXT NOT NULL,
  sermon_passage TEXT NOT NULL,
  offering_desc TEXT NOT NULL,
  offering TEXT NOT NULL,
  benediction_desc TEXT NOT NULL,
  benediction_speaker TEXT NOT NULL,
  modified TIMESTAMP NOT NULL DEFAULT now()
);
