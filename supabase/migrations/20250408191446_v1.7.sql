drop function if exists "public"."get_user_by_username"(username_input text);

alter table "public"."challenges" add column "active" boolean not null default true;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_leaderboard()
 RETURNS TABLE(user_id uuid, username text, solved integer, score integer)
 LANGUAGE sql
 SECURITY DEFINER
AS $function$SELECT
    uc.user_id,
    COALESCE(au.raw_user_meta_data ->> 'display_name', 'Unknown User') AS username,
    COUNT(*) AS solved,
    SUM(CASE 
          WHEN c.difficulty = 1 THEN 1
          WHEN c.difficulty = 2 THEN 2
          WHEN c.difficulty = 3 THEN 3
          ELSE 0
        END) AS score
  FROM
    public.user_challenges uc
  JOIN
    auth.users au ON au.id = uc.user_id
  JOIN
    public.challenges c ON c.id = uc.challenge_id
  WHERE
    c.active = true
  GROUP BY
    uc.user_id, au.raw_user_meta_data ->> 'display_name'
  ORDER BY
    score DESC;$function$
;

CREATE OR REPLACE FUNCTION public.get_user_by_username(username_input text)
 RETURNS TABLE(id uuid, email text, username text, role text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u.email::text,
    (u.raw_user_meta_data ->> 'display_name')::text AS username,
    (u.raw_user_meta_data ->> 'role')::text AS role
  FROM
    auth.users u
  WHERE
    (u.raw_user_meta_data ->> 'display_name') = username_input;
END;
$function$
;


