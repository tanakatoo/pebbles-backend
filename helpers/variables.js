const baseQuery = `SELECT u.username,
                        u.name,
                        u.avatar,
                        c.name_en as country_en,
                        c.name_ja as country_ja,
                        cities.name_en as city_en,
                        cities.name_ja as city_ja,
                        states.name_en as state_en,
                        states.name_ja as state_ja,
                        genders.name as gender,
                        u.about,
                        u.free_trial_start_date,
                        u.study_buddy_bio,
                        u.study_buddy_purpose,
                        l.name as native_language,
                        l2.name as learning_language,
                        ll.name as language_level,
                        tz.name as time_zone,
                        a.name as age_range,
                        u.study_buddy_active,
                        u.study_buddy_activate_date,
                        u.free_trial_start_date
                    FROM users u
                    LEFT JOIN countries c on c.id=u.country_id
                    LEFT JOIN cities on cities.id=u.city_id
                    LEFT JOIN states on states.id=u.state_id
                    LEFT JOIN genders on genders.id=u.gender_id
                    LEFT JOIN languages l on l.id=u.study_buddy_native_language_id
                    LEFT JOIN languages l2 on l2.id=u.study_buddy_learning_language_id
                    LEFT JOIN language_levels ll on ll.id=u.study_buddy_language_level_id
                    LEFT JOIN timezones tz on tz.id=u.study_buddy_timezone_id
                    LEFT JOIN age_ranges a on a.id=u.study_buddy_age_range_id`

const privateBaseQuery = `SELECT u.id,
                        COALESCE(u.username,'') AS username,
                        COALESCE(u.name, '') as name,
                        COALESCE(u.email,'') AS email,
                        COALESCE(u.role,'') AS role,
                        COALESCE(u.avatar,'') AS avatar,
                        u.sign_up_date,
                        u.last_login_date,
                        COALESCE(l3.name,'') AS language_preference,
                        COALESCE(c.name_en,'') as country_en,
                        COALESCE(c.name_ja,'') as country_ja,
                        COALESCE(cities.name_en, '') as city_en,
                        COALESCE(cities.name_ja, '') as city_ja,
                        COALESCE(states.name_en,'') as state_en,
                        COALESCE(states.name_ja,'') as state_ja,
                        COALESCE(genders.name,'') AS gender,
                        COALESCE(u.about, '') as about,
                        COALESCE(u.myway_advice,'') AS myway_advice,
                        COALESCE(u.myway_habits,'') AS myway_habits,
                        COALESCE(ml.name,'') AS motivational_level,
                        COALESCE(st.name,'') AS study_time,
                        pa.join_date AS premium_join_date,
                        pa.end_date AS premium_end_date,
                        COALESCE(pa.raz_reading_level,'') AS raz_reading_level,
                        COALESCE(u.study_buddy_bio,'') AS study_buddy_bio,
                        COALESCE(l.name,'') AS native_language,
                        COALESCE(l2.name,'') AS learning_language,
                        COALESCE(ll.name,'') AS language_level,
                        COALESCE(mwll.name,'') AS myway_language_level,
                        COALESCE(tz.name,'') AS time_zone,
                        COALESCE(a.name,'') AS age_range,
                        u.study_buddy_active,
                        COALESCE(u.study_buddy_purpose,'') AS study_buddy_purpose,
                        u.free_trial_start_date
                        FROM users u
                        LEFT JOIN countries c on c.id=u.country_id
                        LEFT JOIN cities on cities.id=u.city_id
                        LEFT JOIN states on states.id=u.state_id
                        LEFT JOIN genders on genders.id=u.gender_id
                        LEFT JOIN languages l3 on l3.id=u.language_preference
                        LEFT JOIN languages l on l.id=u.study_buddy_native_language_id
                        LEFT JOIN languages l2 on l2.id=u.study_buddy_learning_language_id
                        LEFT JOIN language_levels ll on ll.id=u.study_buddy_language_level_id
                        LEFT JOIN language_levels mwll on mwll.id=u.myway_language_level_id
                        LEFT JOIN timezones tz on tz.id=u.study_buddy_timezone_id
                        LEFT JOIN age_ranges a on a.id=u.study_buddy_age_range_id
                        LEFT JOIN premium_accts pa on pa.id=u.premium_acct_id
                        LEFT JOIN motivation_levels ml on ml.id=u.myway_motivation_level_id
                        LEFT JOIN study_times st on st.id=u.myway_study_time_id`

module.exports = { baseQuery, privateBaseQuery }