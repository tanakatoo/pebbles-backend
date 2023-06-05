INSERT INTO timezones(name, lang)
VALUES ('Los Angeles (UTC-7)','EN'),
('Chicago (UTC-5)','EN'),
('New York (UTC-4)','EN'),
('Toronto (UTC-4)','EN'),
('Sao Paulo (UTC-3)','EN'),
('London (UTC+1)','EN'),
('Paris (UTC+2)','EN'),
('Zurich (UTC+2)','EN'),
('Cairo (UTC+3)','EN'),
('Moscow (UTC+3)','EN'),
('Dubai (UTC+4)','EN'),
('Hong Kong (UTC+8)','EN'),
('Shanghai (UTC+8)','EN'),
('Singapore (UTC+8)','EN'),
('Tokyo (UTC+9)','EN'),
('Sydney (UTC+10)','EN'),
('ロサンゼルス (UTC-7)','JA'),
('シカゴ (UTC-5)','JA'),
('ニューヨーク (UTC-4)','JA'),
('トロント (UTC-4)','JA'),
('サンパウロ (UTC-3)','JA'),
('ロンドン (UTC+1)','JA'),
('パリ (UTC+2)','JA'),
('チューリッヒ (UTC+2)','JA'),
('カイロ (UTC+3)','JA'),
('モスクワ (UTC+3)','JA'),
('ドバイ (UTC+4)','JA'),
('香港 (UTC+8)','JA'),
('上海 (UTC+8)','JA'),
('シンガポール (UTC+8)','JA'),
('東京 (UTC+9)','JA'),
('シドニー (UTC+10)','JA');


INSERT INTO genders(name)
VALUES ('male'),('female'),('other');

INSERT INTO age_ranges(name)
VALUES ('18 - 25'),('26 - 35'),('36 - 45'),('46 - 59'),('60+');

INSERT INTO users(username, password,email,role,sign_up_date,last_login_date,language_preference, gender_id)
VALUES ('ktoo','password','karmen.tanaka@gmail.com','admin','2023-05-01','2023-05-01','EN',1);

INSERT INTO goals(name, lang)
VALUES ('Vocabulary', 'EN'),('Pronunciation', 'EN'),('Listening', 'EN'),('Writing', 'EN'),('Speaking', 'EN'),('語彙', 'JA'),('発音', 'JA'),('リスニング', 'JA'),('書く', 'JA'),('スピーキング', 'JA');

INSERT INTO motivation_levels(name, lang)
VALUES ('English', 'EN'),('Japanese','JA'),('英語', 'EN'),('日本語','JA');

INSERT INTO study_time(name, lang)
VALUES ('Everyday', 'EN'),('3 times a week', 'EN'),('Once a week', 'EN'),('Not frequent', 'EN'),('Never', 'EN'),('毎日', 'JA'),('週３', 'JA'),('週1', 'JA'),('あまりできない', 'JA'),('まったく', 'JA');

INSERT INTO study_buddy_types(name, lang)
VALUES ('Study buddy','EN'),('Language exchange', 'EN'),('Volunteer','EN'),('一緒に学習','JA'),('言語交換', 'JA'),('ボランティア','JA');

INSERT INTO languages(name, lang)
VALUES ('English', 'EN'),('Japanese','JA'),('英語', 'JA'),('日本語','JA');

INSERT INTO language_levels(name, lang)
VALUES ('Beginner','EN'),('Intermediate','EN'),('Advanced','EN'),('初心者','JA'),('中級者','JA'),('上級者','JA');
