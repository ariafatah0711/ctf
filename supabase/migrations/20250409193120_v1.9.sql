create table "public"."client_challenges" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "title" text not null,
    "description" text,
    "difficulty" bigint,
    "url" text,
    "hint" text,
    "tags" text[],
    "submitted_at" timestamp with time zone default now(),
    "reviewed" boolean default false,
    "accepted" boolean default false
);


CREATE UNIQUE INDEX client_challenges_pkey ON public.client_challenges USING btree (id);

alter table "public"."client_challenges" add constraint "client_challenges_pkey" PRIMARY KEY using index "client_challenges_pkey";

grant delete on table "public"."client_challenges" to "anon";

grant insert on table "public"."client_challenges" to "anon";

grant references on table "public"."client_challenges" to "anon";

grant select on table "public"."client_challenges" to "anon";

grant trigger on table "public"."client_challenges" to "anon";

grant truncate on table "public"."client_challenges" to "anon";

grant update on table "public"."client_challenges" to "anon";

grant delete on table "public"."client_challenges" to "authenticated";

grant insert on table "public"."client_challenges" to "authenticated";

grant references on table "public"."client_challenges" to "authenticated";

grant select on table "public"."client_challenges" to "authenticated";

grant trigger on table "public"."client_challenges" to "authenticated";

grant truncate on table "public"."client_challenges" to "authenticated";

grant update on table "public"."client_challenges" to "authenticated";

grant delete on table "public"."client_challenges" to "service_role";

grant insert on table "public"."client_challenges" to "service_role";

grant references on table "public"."client_challenges" to "service_role";

grant select on table "public"."client_challenges" to "service_role";

grant trigger on table "public"."client_challenges" to "service_role";

grant truncate on table "public"."client_challenges" to "service_role";

grant update on table "public"."client_challenges" to "service_role";


