set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_most_solved_challenges()
 RETURNS TABLE(title text, times_solved integer)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    c.title,
    COUNT(*) AS times_solved
  FROM user_challenges uc
  JOIN challenges c ON uc.challenge_id = c.id
  GROUP BY c.title
  ORDER BY times_solved DESC
  LIMIT 10;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_top_users()
 RETURNS TABLE(username text, solved integer)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    u.raw_user_meta_data ->> 'display_name' AS username,
    COUNT(*) AS solved
  FROM user_challenges uc
  JOIN auth.users u ON uc.user_id = u.id
  GROUP BY username
  ORDER BY solved DESC
  LIMIT 10;
END;
$function$
;


