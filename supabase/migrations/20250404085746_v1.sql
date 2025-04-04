alter table "public"."challenges" add column "flag_hash" text not null;

alter table "public"."user_challenges" drop column "flag";

alter table "public"."user_challenges" drop column "is_flag_valid";

CREATE UNIQUE INDEX challenges_flag_hash_key ON public.challenges USING btree (flag_hash);

alter table "public"."challenges" add constraint "challenges_flag_hash_key" UNIQUE using index "challenges_flag_hash_key";


