\echo 'Delete and recreate pebbles db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE pebbles;
CREATE DATABASE pebbles;
\connect pebbles

\i pebbles-schema.sql
\i pebbles-seed.sql

\echo 'Delete and recreate pebbles_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE pebbles_test;
CREATE DATABASE pebbles_test;
\connect pebbles_test

\i pebbles-schema.sql
