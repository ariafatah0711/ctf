alter table "public"."challenges" add column "file_url" text;

alter table "public"."challenges" add column "hint" text;

alter table "public"."challenges" add column "tags" text[];

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_challenge_solves()
 RETURNS TABLE(challenge_id uuid, solve_count bigint)
 LANGUAGE sql
AS $function$
  select challenge_id, count(*) as solve_count
  from user_challenges
  group by challenge_id;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_challenge_solves()
 RETURNS TABLE(user_id uuid, challenge_id uuid, solve_count bigint)
 LANGUAGE sql
AS $function$
  select uc.user_id, uc.challenge_id, count(*) as solve_count
  from user_challenges uc
  group by uc.user_id, uc.challenge_id;
$function$
;


