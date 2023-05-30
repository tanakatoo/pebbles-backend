INSERT INTO timezones(name, lang)
VALUES ('Los Angeles (UTC-7)','en'),
('Chicago (UTC-5)','en'),
('New York (UTC-4)','en'),
('Toronto (UTC-4)','en'),
('Sao Paulo (UTC-3)','en'),
('London (UTC+1)','en'),
('Paris (UTC+2)','en'),
('Zurich (UTC+2)','en'),
('Cairo (UTC+3)','en'),
('Moscow (UTC+3)','en')
('Dubai (UTC+4)','en'),
('Hong Kong (UTC+8)','en'),
('Shanghai (UTC+8)','en'),
('Singapore (UTC+8)','en'),
('Tokyo (UTC+9)','en'),
('Sydney (UTC+10)','en'),
('ロサンゼルス (UTC-7)','ja'),
('シカゴ (UTC-5)','ja'),
('ニューヨーク (UTC-4)','ja'),
('トロント (UTC-4)','ja'),
('サンパウロ (UTC-3)','ja'),
('ロンドン (UTC+1)','ja'),
('パリ (UTC+2)','ja'),
('チューリッヒ (UTC+2)','ja'),
('カイロ (UTC+3)','ja'),
('モスクワ (UTC+3)','ja')
('ドバイ (UTC+4)','ja'),
('香港 (UTC+8)','ja'),
('上海 (UTC+8)','ja'),
('シンガポール (UTC+8)','ja'),
('東京 (UTC+9)','ja'),
('シドニー (UTC+10)','ja');


INSERT INTO genders(name, lang)
VALUES ('male','en'),('female','en'),('other','en'),('男性','en'),('女性','en'),('その他','en');

INSERT INTO age_ranges(name)
VALUES ('10-20'),('21-39'),('40-59'),('60+');

INSERT INTO users(username, password,email,role,sign_up_date,last_login_date,language_preference)
VALUES('ktoo','password','karmen.tanaka@gmail.com','admin','2023-05-01','2023-05-01','en');