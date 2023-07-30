INSERT INTO timezones(name)
VALUES ('LosAngeles'),
('Chicago'),
('NewYork'),
('Toronto'),
('SaoPaulo'),
('London'),
('Paris'),
('Zurich'),
('Cairo'),
('Moscow'),
('Dubai'),
('HongKong'),
('Shanghai'),
('Singapore'),
('Tokyo'),
('Sydney');


INSERT INTO genders(name)
VALUES ('male'),('female'),('other');

INSERT INTO age_ranges(name)
VALUES ('18-25'),('26-35'),('36-45'),('46-59'),('60+');

INSERT INTO goals(name)
VALUES ('Vocabulary'),('Pronunciation'),('Listening'),('Writing'),('Speaking');

INSERT INTO motivation_levels(name)
VALUES ('Very'),('Average'),('Low'),('None');

INSERT INTO study_times(name)
VALUES ('everyday'),('three'),('once'),('notFrequent'),('never');

INSERT INTO study_buddy_types(name)
VALUES ('StudyBuddy'),('LanguageExchange'),('Volunteer');

INSERT INTO languages(name)
VALUES ('English'),('Japanese');

INSERT INTO language_levels(name)
VALUES ('Beginner'),('Intermediate'),('Advanced');

INSERT INTO users(username, password,email,role,sign_up_date,last_login_date,language_preference, gender_id, 
study_buddy_active,
study_buddy_timezone_id,
study_buddy_native_language_id,
study_buddy_learning_language_id,
study_buddy_language_level_id,
study_buddy_bio,
study_buddy_purpose) /*password is asdfasdf*/
VALUES ('jim','$2b$12$LCkeEtenLBV490vZDhi6gOwA67qVD9UfYyhdVSkKdqvvQAGDWDHf6','jim@test.com','regular','2023-05-01','2023-05-01',1,1,
true,1,1,2,1,'bio jim','purpose jim')