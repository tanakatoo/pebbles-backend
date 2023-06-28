/* if tables exist, delete it */

CREATE TABLE countries(
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(100) UNIQUE NOT NULL,
    name_ja VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE states(
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(100) UNIQUE NOT NULL,
    name_ja VARCHAR(100) UNIQUE NOT NULL,
    country_id INTEGER REFERENCES countries(id) ON DELETE SET NULL
);


CREATE TABLE cities(
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(100) UNIQUE NOT NULL,
    name_ja VARCHAR(100) UNIQUE NOT NULL,
    state_id INTEGER REFERENCES states(id) ON DELETE SET NULL
);


CREATE TABLE timezones(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE age_ranges(
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE genders(
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL
);

/* list of all the premium accounts*/
CREATE TABLE premium_accts(
  id SERIAL PRIMARY KEY,
  join_date DATE NOT NULL,
  end_date DATE,
  raz_reading_level VARCHAR(20)
);

CREATE TABLE goals(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);


CREATE TABLE motivation_levels(
    id SERIAL PRIMARY KEY,
    name varchar(50) NOT NULL
);

CREATE TABLE study_times(
    id SERIAL PRIMARY KEY,
    name varchar(50) NOT NULL
);

CREATE TABLE study_buddy_types(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE languages(
    id SERIAL PRIMARY KEY,
    name varchar(50) NOT NULL
);

CREATE TABLE language_levels(
    id SERIAL PRIMARY KEY,
    name varchar(50) NOT NULL
);

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(25) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    premium_acct_id INTEGER REFERENCES premium_accts(id) ON DELETE SET NULL,
    name VARCHAR(100),
    email TEXT NOT NULL
        CHECK (position('@' IN email) > 1),
    role VARCHAR(20) NOT NULL DEFAULT 'regular',
    sign_up_date DATE NOT NULL DEFAULT CURRENT_DATE,
    last_login_date DATE NOT NULL DEFAULT CURRENT_DATE,
    free_trial_start_date DATE,
    country_id INTEGER REFERENCES countries(id) ON DELETE SET NULL,
    city_id INTEGER REFERENCES cities(id) ON DELETE SET NULL,
    state_id INTEGER REFERENCES states(id) ON DELETE SET NULL,
    language_preference INTEGER REFERENCES languages(id) ON DELETE SET NULL,
    gender_id INTEGER REFERENCES genders(id) ON DELETE SET NULL,
    about TEXT,
    avatar VARCHAR(50) DEFAULT floor(random() *14+1)::varchar || '.jpg',
    myway_habits TEXT,
    myway_advice TEXT,
    myway_language_level_id INTEGER REFERENCES language_levels(id) ON DELETE SET NULL,
    myway_used BOOLEAN DEFAULT false,
    myway_motivation_level_id INTEGER REFERENCES motivation_levels(id) ON DELETE SET NULL,
    myway_study_time_id INTEGER REFERENCES study_times(id) ON DELETE SET NULL,
    study_buddy_purpose TEXT,
    study_buddy_bio TEXT,
    study_buddy_native_language_id INTEGER REFERENCES languages(id) ON DELETE SET NULL,
    study_buddy_learning_language_id INTEGER REFERENCES languages(id) ON DELETE SET NULL,
    study_buddy_language_level_id INTEGER REFERENCES language_levels(id) ON DELETE SET NULL,
    study_buddy_timezone_id INTEGER REFERENCES timezones(id) ON DELETE SET NULL,
    study_buddy_age_range_id INTEGER REFERENCES age_ranges(id) ON DELETE SET NULL,
    study_buddy_active BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE study_buddy_types_users(
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    study_buddy_type_id INTEGER NOT NULL REFERENCES study_buddy_types(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, study_buddy_type_id)
);


CREATE TABLE goals_users(
    goal_id INTEGER  NOT NULL,
    user_id INTEGER  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (goal_id, user_id)
);

CREATE TABLE sub_accts(
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  premium_acct_id INTEGER REFERENCES premium_accts(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  age_range_id INTEGER REFERENCES age_ranges(id) ON DELETE SET NULL
);

CREATE TABLE messages(
    id SERIAL PRIMARY  KEY,
    from_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    msg TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT false,
    sent_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (current_timestamp AT TIME ZONE 'UTC')
);

CREATE INDEX idx_date ON messages (sent_at DESC);

CREATE TABLE blocked_users(
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    blocked_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (blocked_user_id, user_id)
);

CREATE TABLE saved(
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    saved_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, saved_id)
);