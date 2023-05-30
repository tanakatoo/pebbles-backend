/* if tables exist, delete it */

CREATE TABLE countries(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    lang VARCHAR(2) NOT NULL
);

CREATE TABLE cities(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    lang VARCHAR(2) NOT NULL
);

CREATE TABLE states(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    lang VARCHAR(2) NOT NULL
);

CREATE TABLE timezones(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    lang VARCHAR(2) NOT NULL
);

CREATE TABLE age_ranges(
    id SERIAL PRIMARY KEY,
    name VARCHAR(5) UNIQUE NOT NULL
);

CREATE TABLE genders(
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL,
    lang VARCHAR(2) NOT NULL
);

/* list of all the premium accounts*/
CREATE TABLE premium_accts(
  id SERIAL PRIMARY KEY,
  join_date DATE NOT NULL,
  end_date DATE,
  raz_reading_level VARCHAR(20)
);

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(25) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    premium_acct_id INTEGER REFERENCES premium_accts(id) ON DELETE SET NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email TEXT NOT NULL
        CHECK (position('@' IN email) > 1),
    role VARCHAR(20) NOT NULL DEFAULT 'regular',
    sign_up_date DATE NOT NULL DEFAULT CURRENT_DATE,
    last_login_date DATE NOT NULL DEFAULT CURRENT_DATE,
    country_id INTEGER REFERENCES countries(id) ON DELETE SET NULL,
    city_id INTEGER REFERENCES countries(id) ON DELETE SET NULL,
    state_id INTEGER REFERENCES countries(id) ON DELETE SET NULL,
    timezone_id INTEGER REFERENCES timezones(id) ON DELETE SET NULL,
    language_preference VARCHAR(2) NOT NULL DEFAULT 'en',
    age_range_id INTEGER REFERENCES age_ranges(id) ON DELETE SET NULL,
    gender_id INTEGER REFERENCES genders(id) ON DELETE SET NULL
);



CREATE TABLE sub_accts(
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  premium_acct_id INTEGER REFERENCES premium_accts(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  age_range_id INTEGER REFERENCES age_ranges(id) ON DELETE SET NULL
);