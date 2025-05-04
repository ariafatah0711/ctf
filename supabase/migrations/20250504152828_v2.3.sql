set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_leaderboard_1()
 RETURNS TABLE(user_id uuid, username text, solved integer, score integer, first_solved_at timestamp without time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT
    uc.user_id,
    coalesce(au.raw_user_meta_data ->> 'display_name', 'Unknown User') AS username,
    count(*) AS solved,
    sum(CASE 
          WHEN c.difficulty = 1 THEN 1
          WHEN c.difficulty = 2 THEN 2
          WHEN c.difficulty = 3 THEN 3
          ELSE 0
        END) AS score,
    min(uc.completed_at) AS first_solved_at
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
    score DESC,
    first_solved_at ASC;
$function$
;

CREATE OR REPLACE FUNCTION public.get_challenge_history_by_username(p_username text DEFAULT NULL::text, p_page integer DEFAULT 1, p_limit integer DEFAULT 10)
 RETURNS TABLE(user_id uuid, username text, challenge_id uuid, title text, difficulty integer, completed_at timestamp without time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    uc.user_id,
    COALESCE(au.raw_user_meta_data ->> 'display_name', 'Unknown User') AS username,
    c.id AS challenge_id,
    c.title,
    c.difficulty,
    uc.completed_at
  FROM
    public.user_challenges uc
  JOIN
    auth.users au ON uc.user_id = au.id
  JOIN
    public.challenges c ON c.id = uc.challenge_id
  WHERE
    (p_username IS NULL OR au.username = p_username)
  ORDER BY
    uc.completed_at DESC
  LIMIT p_limit OFFSET (p_page - 1) * p_limit;
END;
$function$
;


