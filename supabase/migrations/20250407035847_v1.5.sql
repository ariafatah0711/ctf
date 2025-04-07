drop function if exists "public"."get_leaderboard"();

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_leaderboard()
 RETURNS TABLE(user_id uuid, username text, solved integer, score integer)
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  SELECT
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
  GROUP BY
    uc.user_id, au.raw_user_meta_data ->> 'display_name'
  ORDER BY
    score DESC;
$function$
;


