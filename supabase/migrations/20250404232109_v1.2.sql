alter table "public"."challenges" drop column "file_url";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_leaderboard()
 RETURNS TABLE(user_id uuid, username text, total_solve_count integer)
 LANGUAGE sql
AS $function$
  SELECT
    uc.user_id,
    u.username,
    COUNT(*) AS total_solve_count
  FROM
    user_challenges uc
  JOIN
    users u ON uc.user_id = u.id
  GROUP BY
    uc.user_id, u.username
  ORDER BY
    total_solve_count DESC;
$function$
;


