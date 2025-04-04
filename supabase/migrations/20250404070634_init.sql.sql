create type "public"."role_type" as enum ('admin', 'maker', 'user');

create table "public"."challenges" (
    "title" text,
    "description" text,
    "difficulty" bigint,
    "flag" text,
    "created_at" timestamp with time zone not null default now(),
    "id" uuid not null default gen_random_uuid(),
    "url" text
);


create table "public"."user_challenges" (
    "user_id" uuid not null,
    "challenge_id" uuid not null,
    "flag" text not null,
    "is_flag_valid" boolean not null default false,
    "completed_at" timestamp with time zone default now()
);


create table "public"."users" (
    "id" uuid not null default gen_random_uuid(),
    "username" text,
    "email" text,
    "password" text,
    "created_at" timestamp with time zone not null default now(),
    "role" role_type not null default 'user'::role_type
);


CREATE UNIQUE INDEX challenges_flag_key ON public.challenges USING btree (flag);

CREATE UNIQUE INDEX challenges_pkey_temp ON public.challenges USING btree (id);

CREATE UNIQUE INDEX unique_title ON public.challenges USING btree (title);

CREATE UNIQUE INDEX user_challenges_pkey ON public.user_challenges USING btree (user_id, challenge_id);

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);

alter table "public"."challenges" add constraint "challenges_pkey_temp" PRIMARY KEY using index "challenges_pkey_temp";

alter table "public"."user_challenges" add constraint "user_challenges_pkey" PRIMARY KEY using index "user_challenges_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."challenges" add constraint "challenges_flag_key" UNIQUE using index "challenges_flag_key";

alter table "public"."challenges" add constraint "unique_title" UNIQUE using index "unique_title";

alter table "public"."user_challenges" add constraint "user_challenges_challenge_id_fkey" FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE not valid;

alter table "public"."user_challenges" validate constraint "user_challenges_challenge_id_fkey";

alter table "public"."user_challenges" add constraint "user_challenges_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."user_challenges" validate constraint "user_challenges_user_id_fkey";

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

alter table "public"."users" add constraint "users_username_key" UNIQUE using index "users_username_key";

grant delete on table "public"."challenges" to "anon";

grant insert on table "public"."challenges" to "anon";

grant references on table "public"."challenges" to "anon";

grant select on table "public"."challenges" to "anon";

grant trigger on table "public"."challenges" to "anon";

grant truncate on table "public"."challenges" to "anon";

grant update on table "public"."challenges" to "anon";

grant delete on table "public"."challenges" to "authenticated";

grant insert on table "public"."challenges" to "authenticated";

grant references on table "public"."challenges" to "authenticated";

grant select on table "public"."challenges" to "authenticated";

grant trigger on table "public"."challenges" to "authenticated";

grant truncate on table "public"."challenges" to "authenticated";

grant update on table "public"."challenges" to "authenticated";

grant delete on table "public"."challenges" to "service_role";

grant insert on table "public"."challenges" to "service_role";

grant references on table "public"."challenges" to "service_role";

grant select on table "public"."challenges" to "service_role";

grant trigger on table "public"."challenges" to "service_role";

grant truncate on table "public"."challenges" to "service_role";

grant update on table "public"."challenges" to "service_role";

grant delete on table "public"."user_challenges" to "anon";

grant insert on table "public"."user_challenges" to "anon";

grant references on table "public"."user_challenges" to "anon";

grant select on table "public"."user_challenges" to "anon";

grant trigger on table "public"."user_challenges" to "anon";

grant truncate on table "public"."user_challenges" to "anon";

grant update on table "public"."user_challenges" to "anon";

grant delete on table "public"."user_challenges" to "authenticated";

grant insert on table "public"."user_challenges" to "authenticated";

grant references on table "public"."user_challenges" to "authenticated";

grant select on table "public"."user_challenges" to "authenticated";

grant trigger on table "public"."user_challenges" to "authenticated";

grant truncate on table "public"."user_challenges" to "authenticated";

grant update on table "public"."user_challenges" to "authenticated";

grant delete on table "public"."user_challenges" to "service_role";

grant insert on table "public"."user_challenges" to "service_role";

grant references on table "public"."user_challenges" to "service_role";

grant select on table "public"."user_challenges" to "service_role";

grant trigger on table "public"."user_challenges" to "service_role";

grant truncate on table "public"."user_challenges" to "service_role";

grant update on table "public"."user_challenges" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

create policy "Enable insert for authenticated users only"
on "public"."challenges"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::role_type)))));


create policy "Enable read access for all users"
on "public"."challenges"
as permissive
for select
to public
using (true);



