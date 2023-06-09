INSERT INTO timezones(name)
VALUES ('Los Angeles'),
('Chicago'),
('New York'),
('Toronto'),
('Sao Paulo'),
('London'),
('Paris'),
('Zurich'),
('Cairo'),
('Moscow'),
('Dubai'),
('Hong Kong'),
('Shanghai'),
('Singapore'),
('Tokyo'),
('Sydney');


INSERT INTO genders(name)
VALUES ('male'),('female'),('other');

INSERT INTO age_ranges(name)
VALUES ('18 - 25'),('26 - 35'),('36 - 45'),('46 - 59'),('60+');

INSERT INTO goals(name)
VALUES ('Vocabulary'),('Pronunciation'),('Listening'),('Writing'),('Speaking');

INSERT INTO motivation_levels(name)
VALUES ('Very'),('Average'),('Low'),('None');

INSERT INTO study_time(name)
VALUES ('everyday'),('three'),('once'),('notFrequent'),('never');

INSERT INTO study_buddy_types(name)
VALUES ('Study buddy'),('Language exchange'),('Volunteer');

INSERT INTO languages(name)
VALUES ('English'),('Japanese');

INSERT INTO language_levels(name)
VALUES ('Beginner'),('Intermediate'),('Advanced');

INSERT INTO users(username, password,email,role,sign_up_date,last_login_date,language_preference, gender_id) /*password is asdfasdf*/
VALUES ('ktoo','$2b$12$LCkeEtenLBV490vZDhi6gOwA67qVD9UfYyhdVSkKdqvvQAGDWDHf6','karmen.tanaka@gmail.com','admin','2023-05-01','2023-05-01',1,1),
 ('hello','$2b$12$LCkeEtenLBV490vZDhi6gOwA67qVD9UfYyhdVSkKdqvvQAGDWDHf6','karmen.tanakaa@gmail.com','admin','2023-05-01','2023-05-01',1,1);
