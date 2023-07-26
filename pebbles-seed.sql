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
VALUES ('ktoo','$2b$12$LCkeEtenLBV490vZDhi6gOwA67qVD9UfYyhdVSkKdqvvQAGDWDHf6','karmen.tanaka@gmail.com','admin','2023-05-01','2023-05-01',1,1,
true,1,1,2,1,'bio ktoo','purpose ktoo'),
 ('hello','$2b$12$LCkeEtenLBV490vZDhi6gOwA67qVD9UfYyhdVSkKdqvvQAGDWDHf6','karmen.tanakaa@gmail.com','regular','2023-05-01','2023-05-01',1,1,
 true,2,2,1,1,'hello bio','hello purpose'),
 ('blockMe','$2b$12$LCkeEtenLBV490vZDhi6gOwA67qVD9UfYyhdVSkKdqvvQAGDWDHf6','karmen.tanakaaa@gmail.com','regular','2023-05-01','2023-05-01',1,1,
 true,3,1,2,2,'blockme bio','hello purpose'),
  ('newUser','$2b$12$LCkeEtenLBV490vZDhi6gOwA67qVD9UfYyhdVSkKdqvvQAGDWDHf6','karmen.tanakaaaa@gmail.com','regular','2023-05-01','2023-05-01',1,1,
  true,4,2,1,3,'newuser bio','newuser purpose');

INSERT INTO messages (from_user_id,to_user_id,msg, sent_at, read) 
VALUES (1,2,'first message', '2023-06-07 15:30:00+00:00', true), 
(2,1,'2nd most recent one reply', '2023-06-08 15:30:00+00:00', false),
(1,2,'the most recent one reply to second one', '2023-06-09 15:30:00+00:00', false),
(2,3,'from 2 to 3 first msg','2023-06-04 15:30:00+00:00', true),
(3,2, 'from 3-2 latest message','2023-06-08 15:30:00+00:00', true);

INSERT INTO blocked_users (user_id,blocked_user_id)
VALUES (1,3), (2,3);

INSERT INTO saved (user_id,saved_id, type)
VALUES (1,2, 'user');

-- subquery to get all messages from users that are not blocked
select * from messages where to_user_id != (select blocked_user_id from blocked_users where user_id = 2) and 
from_user_id != (select blocked_user_id from blocked_users where user_id = 2);

--query to get the most recent message from users that are not blocked for the logged in user 
SELECT from_user_id, to_user_id,msg, sent_at, read
FROM (
  SELECT 
    from_user_id, to_user_id,msg, sent_at, read,
    ROW_NUMBER() OVER (PARTITION BY 
      CASE WHEN from_user_id = 2 THEN to_user_id
           ELSE from_user_id
      END
      ORDER BY sent_at DESC) AS rn
  FROM (SELECT * FROM messages 
    WHERE 
    to_user_id not in (SELECT blocked_user_id 
                        FROM blocked_users 
                        WHERE user_id = 2) AND 
    from_user_id not in (SELECT blocked_user_id 
                    FROM blocked_users 
                    WHERE user_id = 2)) as subsubquery
  WHERE 2 IN (from_user_id, to_user_id)
) AS subquery
WHERE rn = 1 ORDER BY read ASC;

--query to get the unread messages

--query to get list of users that a user has contacted or contacted by
SELECT DISTINCT CASE
    WHEN from_user_id = 3 THEN to_user_id
    WHEN to_user_id = 3 THEN from_user_id
END AS user_id
FROM messages
WHERE from_user_id = 3 OR to_user_id = 3;