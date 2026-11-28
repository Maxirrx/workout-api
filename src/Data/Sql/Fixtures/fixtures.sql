-- Load once after migration_1.sql in a fresh test database.
-- Slots 1–32 are shared read-only scenarios. Slots 101–164 and 201–264
-- are reserved for update and delete tests respectively.
-- Reserve one slot per mutating test, including tests run by other workers.
-- Use a fresh database for each run that needs the initial state again.
-- IDs are slot * 100 + offset, independently in each table. Application
-- inserts start at 100000. Use each slot's own records for mutations.
-- The first user in each slot can be found at <scenario>.owner@example.test,
-- for example update-001.owner@example.test (slot 101, user ID 10101).

BEGIN;
SET LOCAL TIME ZONE 'UTC';

CREATE TEMP TABLE fixture_cases (
    slot INTEGER PRIMARY KEY,
    scenario TEXT NOT NULL
) ON COMMIT DROP;

INSERT INTO fixture_cases (slot, scenario)
SELECT n, 'read-' || lpad(n::text, 3, '0') FROM generate_series(1, 32) AS n
UNION ALL
SELECT 100 + n, 'update-' || lpad(n::text, 3, '0') FROM generate_series(1, 64) AS n
UNION ALL
SELECT 200 + n, 'delete-' || lpad(n::text, 3, '0') FROM generate_series(1, 64) AS n;

INSERT INTO roles (id, name, app_id)
SELECT c.slot * 100 + r.row_offset, r.name, 'fixture-' || c.scenario || '-' || r.app
FROM fixture_cases AS c
CROSS JOIN (VALUES (1, 'athlete', 'app'), (2, 'coach', 'wm'),
                   (3, 'reviewer', 'app'), (90, 'unused', 'app')) AS r(row_offset, name, app);

INSERT INTO images (id, url)
SELECT c.slot * 100 + i.row_offset, 'https://fixtures.example.test/' || c.scenario || '/' || i.filename
FROM fixture_cases AS c
CROSS JOIN (VALUES (1, 'profile.png'), (2, 'exercise.png'), (3, 'session-1.png'),
                   (4, 'session-2.png'), (5, 'session-3.png'), (90, 'unused.png')) AS i(row_offset, filename);

-- Users 01–02 are the owner and a friend. User 90 has no dependants.
INSERT INTO users (id, name, email, password, phone, picture_id, is_public, is_enable, email_verified_at)
SELECT c.slot * 100 + u.row_offset, 'Fixture ' || c.scenario || ' ' || u.label,
       c.scenario || '.' || u.label || '@example.test', '!fixture-login-disabled',
       CASE WHEN u.row_offset = 1 THEN '+1555' || lpad(c.slot::text, 7, '0') END,
       CASE WHEN u.row_offset = 1 THEN c.slot * 100 + 1 END,
       u.row_offset = 1, u.row_offset <> 90,
       CASE WHEN u.row_offset = 1 THEN TIMESTAMPTZ '2024-01-01 12:00:00+00' END
FROM fixture_cases AS c
CROSS JOIN (VALUES (1, 'owner'), (2, 'friend'), (90, 'standalone')) AS u(row_offset, label);

INSERT INTO user_roles (user_id, role_id)
SELECT c.slot * 100 + r.user_offset, c.slot * 100 + r.role_offset
FROM fixture_cases AS c
CROSS JOIN (VALUES (1, 1), (1, 2), (2, 3)) AS r(user_offset, role_offset);

INSERT INTO friends (user_id, friend_id, created_at)
SELECT c.slot * 100 + f.user_offset, c.slot * 100 + f.friend_offset, TIMESTAMPTZ '2024-02-01 09:00:00+00'
FROM fixture_cases AS c
CROSS JOIN (VALUES (1, 2), (2, 1)) AS f(user_offset, friend_offset)
WHERE f.user_offset = 1 OR c.slot % 2 = 0;

INSERT INTO muscles (id, name)
SELECT c.slot * 100 + m.row_offset, m.name || ' ' || c.scenario
FROM fixture_cases AS c
CROSS JOIN (VALUES (1, 'Pectoraux'), (2, 'Dorsaux'), (3, 'Biceps'), (4, 'Quadriceps'),
                   (5, 'Abdominaux'), (6, 'Fessiers'), (90, 'Muscle libre')) AS m(row_offset, name);

-- Exercise 90 is outside templates and performances.
INSERT INTO exercises (id, name, picture_id, muscle_1_id, muscle_2_id, muscle_3_id, user_id, is_public)
SELECT c.slot * 100 + e.row_offset, e.name || ' ' || c.scenario,
       CASE WHEN e.row_offset IN (1, 2) THEN c.slot * 100 + 2 END,
       c.slot * 100 + e.primary_muscle, c.slot * 100 + e.secondary_muscle, c.slot * 100 + e.tertiary_muscle,
       c.slot * 100 + 1, e.row_offset IN (1, 2, 4)
FROM fixture_cases AS c
CROSS JOIN (VALUES (1, 'Développé couché', 1, NULL, NULL),
                   (2, 'Tractions', 2, 3, NULL),
                   (3, 'Curl', 3, NULL, NULL),
                   (4, 'Squat', 4, 5, 6),
                   (5, 'Gainage', 5, NULL, NULL),
                   (6, 'Pont fessier', 6, NULL, NULL),
                   (90, 'Exercice libre', 3, NULL, NULL)) AS e(row_offset, name, primary_muscle, secondary_muscle, tertiary_muscle);

-- Template 90 is empty and has no sessions.
INSERT INTO workout_templates (id, name, user_id, is_public)
SELECT c.slot * 100 + t.row_offset, t.name || ' ' || c.scenario, c.slot * 100 + t.owner, t.is_public
FROM fixture_cases AS c
CROSS JOIN (VALUES (1, 'Programme complet', 1, TRUE), (2, 'Programme court', 2, TRUE),
                   (3, 'Programme privé', 1, FALSE), (90, 'Programme vide', 1, FALSE)) AS t(row_offset, name, owner, is_public);

INSERT INTO workout_template_exercises (workout_template_id, exercise_id, position)
SELECT c.slot * 100 + t.template_offset, c.slot * 100 + t.exercise_offset, t.position
FROM fixture_cases AS c
CROSS JOIN (VALUES (1, 4, 1), (1, 1, 2), (1, 6, 3), (1, 2, 4), (1, 5, 5), (1, 3, 6),
                   (2, 2, 1), (2, 5, 2), (3, 6, 1), (3, 1, 2)) AS t(template_offset, exercise_offset, position);

INSERT INTO favorites (user_id, workout_template_id, created_at)
SELECT c.slot * 100 + f.user_offset, c.slot * 100 + f.template_offset, TIMESTAMPTZ '2024-03-01 09:00:00+00'
FROM fixture_cases AS c
CROSS JOIN (VALUES (1, 2), (2, 1)) AS f(user_offset, template_offset);

-- Sessions 01, 02 and 03 have zero, one and three pictures respectively.
-- Session 90 has no pictures or performances.
INSERT INTO workout_sessions (id, user_id, workout_template_id, date_of_workout, is_end)
SELECT c.slot * 100 + s.row_offset, c.slot * 100 + s.user_offset, c.slot * 100 + s.template_offset,
       s.date_of_workout + c.slot * INTERVAL '1 day', s.is_end
FROM fixture_cases AS c
CROSS JOIN (VALUES (1, 1, 1, TIMESTAMPTZ '2024-04-01 08:00:00+00', TRUE),
                   (2, 2, 1, TIMESTAMPTZ '2024-04-02 08:00:00+00', TRUE),
                   (3, 1, 1, TIMESTAMPTZ '2024-04-03 08:00:00+00', FALSE),
                   (4, 1, 2, TIMESTAMPTZ '2099-04-04 08:00:00+00', FALSE),
                   (5, 1, 3, TIMESTAMPTZ '2024-04-05 08:00:00+00', TRUE),
                   (90, 1, 3, TIMESTAMPTZ '2099-04-06 08:00:00+00', FALSE)) AS s(row_offset, user_offset, template_offset, date_of_workout, is_end);

INSERT INTO workout_session_images (workout_session_id, image_id)
SELECT c.slot * 100 + s.session_offset, c.slot * 100 + s.image_offset
FROM fixture_cases AS c
CROSS JOIN (VALUES (2, 3), (3, 3), (3, 4), (3, 5)) AS s(session_offset, image_offset);

-- Performance offsets are session offset * 10 + exercise position.
INSERT INTO performances (id, workout_session_id, exercise_id, status_id, weight, rep, time_seconds, rest_seconds)
SELECT c.slot * 100 + s.session_offset * 10 + t.position,
       ws.id, t.exercise_id, ps.id,
       CASE t.position WHEN 1 THEN 62.50 WHEN 2 THEN 0 WHEN 6 THEN 12.75 END,
       CASE t.position WHEN 1 THEN 8 WHEN 2 THEN 0 WHEN 6 THEN 12 END,
       CASE t.position WHEN 3 THEN 60 WHEN 4 THEN 0 END,
       CASE t.position WHEN 1 THEN 90 WHEN 3 THEN 0 WHEN 5 THEN 45 END
FROM fixture_cases AS c
CROSS JOIN (VALUES (1), (2), (3), (4), (5)) AS s(session_offset)
JOIN workout_sessions AS ws ON ws.id = c.slot * 100 + s.session_offset
JOIN workout_template_exercises AS t ON t.workout_template_id = ws.workout_template_id
LEFT JOIN performance_statuses AS ps ON ps.name = CASE
    WHEN t.position = 6 THEN NULL
    WHEN NOT ws.is_end THEN 'pending'
    WHEN t.position IN (2, 4) THEN 'failed'
    ELSE 'completed'
END;

ALTER TABLE roles ALTER COLUMN id RESTART WITH 100000;
ALTER TABLE images ALTER COLUMN id RESTART WITH 100000;
ALTER TABLE users ALTER COLUMN id RESTART WITH 100000;
ALTER TABLE muscles ALTER COLUMN id RESTART WITH 100000;
ALTER TABLE exercises ALTER COLUMN id RESTART WITH 100000;
ALTER TABLE workout_templates ALTER COLUMN id RESTART WITH 100000;
ALTER TABLE workout_sessions ALTER COLUMN id RESTART WITH 100000;
ALTER TABLE performances ALTER COLUMN id RESTART WITH 100000;

COMMIT;
