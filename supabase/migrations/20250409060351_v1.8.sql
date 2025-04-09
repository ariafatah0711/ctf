set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_challenge_history(p_user_id uuid DEFAULT NULL::uuid, p_page integer DEFAULT 1, p_limit integer DEFAULT 10)
 RETURNS TABLE(user_id uuid, username text, challenge_id uuid, title text, difficulty integer, completed_at timestamp with time zone)
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
    CAST(c.difficulty AS INTEGER) AS difficulty,
    uc.completed_at
  FROM
    public.user_challenges uc
  JOIN
    auth.users au ON uc.user_id = au.id
  JOIN
    public.challenges c ON c.id = uc.challenge_id
  WHERE
    p_user_id IS NULL OR uc.user_id = p_user_id
  ORDER BY
    uc.completed_at DESC
  LIMIT p_limit OFFSET (p_page - 1) * p_limit;
END;
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

CREATE OR REPLACE FUNCTION public.get_user_challenge_history(p_user_id uuid)
 RETURNS TABLE(challenge_id uuid, title text, difficulty integer, completed_at timestamp with time zone)
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  SELECT
    c.id AS challenge_id,
    c.title,
    c.difficulty,
    uc.completed_at
  FROM
    public.user_challenges uc
  JOIN
    public.challenges c ON c.id = uc.challenge_id
  WHERE
    uc.user_id = p_user_id
  ORDER BY
    uc.completed_at DESC;
$function$
;


