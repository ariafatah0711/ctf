alter table "public"."user_challenges" drop constraint "user_challenges_user_id_fkey";

drop function if exists "public"."get_leaderboard"();

alter table "public"."user_challenges" add constraint "user_challenges_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_challenges" validate constraint "user_challenges_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_by_username(username_input text)
 RETURNS TABLE(id uuid, username text, role text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'auth'
AS $function$
begin
  return query
  select
    u.id,
    u.raw_user_meta_data ->> 'display_name' as username,
    u.raw_user_meta_data ->> 'role' as role
  from
    auth.users u
  where
    u.raw_user_meta_data ->> 'display_name' = username_input;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_leaderboard()
 RETURNS TABLE(user_id uuid, username text, solved integer)
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  SELECT
    uc.user_id,
    COALESCE(au.raw_user_meta_data ->> 'display_name', 'Unknown User') AS username,
    COUNT(*) AS solved
  FROM
    public.user_challenges uc
  JOIN
    auth.users au ON au.id = uc.user_id
  GROUP BY
    uc.user_id, au.raw_user_meta_data ->> 'display_name'
  ORDER BY
    solved DESC;
$function$
;


