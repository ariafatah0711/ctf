alter table "public"."client_challenges" add constraint "client_challenges_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."client_challenges" validate constraint "client_challenges_user_id_fkey";


