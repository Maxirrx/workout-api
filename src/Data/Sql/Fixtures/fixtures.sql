BEGIN;

INSERT INTO users (name, email, password, email_verified_at)
SELECT 'Athlète ' || lpad(n::text, 2, '0'),
       'athlete' || lpad(n::text, 2, '0') || '@example.test',
       '!fixture-login-disabled',
       CASE WHEN n % 4 = 0 THEN NULL ELSE TIMESTAMPTZ '2026-01-01 12:00:00+00' END
FROM generate_series(1, 20) AS n;

INSERT INTO muscles (name)
SELECT name FROM unnest(ARRAY[
    'Pectoraux', 'Dorsaux', 'Biceps', 'Triceps', 'Epaules', 'Abdominaux',
    'Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets', 'Avant-bras',
    'Trapèzes', 'Lombaires', 'Adducteurs', 'Obliques', 'Deltoïdes',
    'Grand dorsal', 'Dentelé antérieur'
]) AS name;

WITH muscle_ids AS (SELECT array_agg(id ORDER BY id) AS ids FROM muscles)
INSERT INTO exercises (name, muscle_1_id, muscle_2_id, muscle_3_id, user_id, is_public)
SELECT 'Mouvement ' || n || ' de ' || u.name,
       m.ids[((n + u.id - 2) % 18 + 1)::integer],
       CASE WHEN n % 3 = 0 THEN NULL ELSE m.ids[((n + u.id - 1) % 18 + 1)::integer] END,
       CASE WHEN n % 4 = 0 THEN m.ids[((n + u.id) % 18 + 1)::integer] ELSE NULL END,
       u.id,
       n % 2 = 0
FROM users AS u
CROSS JOIN generate_series(1, 6) AS n
CROSS JOIN muscle_ids AS m;

INSERT INTO workout_templates (name, user_id, is_public)
SELECT 'Programme ' || n || ' de ' || u.name, u.id, n % 2 = 0
FROM users AS u
CROSS JOIN generate_series(1, 3) AS n;

INSERT INTO workout_template_exercises (workout_template_id, exercise_id, position)
SELECT t.id, e.id, row_number() OVER (PARTITION BY t.id ORDER BY e.id)::integer
FROM workout_templates AS t
CROSS JOIN LATERAL (
    SELECT e.id
    FROM exercises AS e
    WHERE e.user_id = t.user_id
    ORDER BY e.id
    OFFSET ((t.id - 1) % 2) LIMIT 5
) AS e;

INSERT INTO favorites (user_id, workout_template_id, created_at)
SELECT u.id, t.id, TIMESTAMPTZ '2026-05-01 09:00:00+00'
FROM users AS u
CROSS JOIN LATERAL (
    SELECT t.id
    FROM workout_templates AS t
    WHERE t.is_public AND t.user_id <> u.id
    ORDER BY t.id
    OFFSET ((u.id - 1) % 5) LIMIT 5
) AS t;

INSERT INTO workout_sessions (user_id, workout_template_id, date_of_workout, is_end)
SELECT t.user_id, t.id,
       TIMESTAMPTZ '2026-01-10 08:00:00+00' + (t.id * 3 + n) * INTERVAL '1 day',
       TRUE
FROM workout_templates AS t
CROSS JOIN generate_series(1, 2) AS n;

INSERT INTO workout_sessions (user_id, workout_template_id, date_of_workout, is_end)
SELECT t.user_id, t.id, TIMESTAMPTZ '2030-01-01 08:00:00+00', FALSE
FROM workout_templates AS t
WHERE t.name LIKE 'Programme 1 de %';

INSERT INTO performances (workout_session_id, exercise_id, weight, rep, time_seconds, rest_seconds)
SELECT s.id, te.exercise_id,
       20 + (s.id % 10) * 2,
       (8 + s.id % 7)::integer,
       CASE WHEN te.position % 2 = 0 THEN 60 + te.position * 5 ELSE NULL END,
       45 + te.position * 10
FROM workout_sessions AS s
JOIN workout_template_exercises AS te ON te.workout_template_id = s.workout_template_id
WHERE s.is_end;

COMMIT;