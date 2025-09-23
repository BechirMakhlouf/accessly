SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', 'b986c5cc-6feb-4d7e-84a0-8093eced8e0e', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"test@test.com","user_id":"041eb9c5-372a-469b-af75-825cd34b7e2d","user_phone":""}}', '2025-09-21 15:22:46.97823+00', ''),
	('00000000-0000-0000-0000-000000000000', '32a9b773-6f5e-47b8-9479-5b036156c957', '{"action":"login","actor_id":"041eb9c5-372a-469b-af75-825cd34b7e2d","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-21 15:23:13.915785+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '041eb9c5-372a-469b-af75-825cd34b7e2d', 'authenticated', 'authenticated', 'test@test.com', '$2a$10$b6D/iT.CATI.A23/WV3neebPtW2GeKqoPtThLas61cBOFO9ocr1Za', '2025-09-21 15:22:46.979354+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-09-21 15:23:13.916135+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-21 15:22:46.974563+00', '2025-09-21 15:23:13.918176+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('041eb9c5-372a-469b-af75-825cd34b7e2d', '041eb9c5-372a-469b-af75-825cd34b7e2d', '{"sub": "041eb9c5-372a-469b-af75-825cd34b7e2d", "email": "test@test.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-21 15:22:46.977678+00', '2025-09-21 15:22:46.977712+00', '2025-09-21 15:22:46.977712+00', '4465195e-7057-4ec5-a8b4-25d7f673fe50');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('59be3fac-dd89-4dd0-a445-bd9de0b7403c', '041eb9c5-372a-469b-af75-825cd34b7e2d', '2025-09-21 15:23:13.916175+00', '2025-09-21 15:23:13.916175+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '172.27.0.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('59be3fac-dd89-4dd0-a445-bd9de0b7403c', '2025-09-21 15:23:13.918427+00', '2025-09-21 15:23:13.918427+00', 'password', '89eb7776-0ba4-4f09-ad75-ed735c42f324');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 1, 'nnthyan7fzd3', '041eb9c5-372a-469b-af75-825cd34b7e2d', false, '2025-09-21 15:23:13.917104+00', '2025-09-21 15:23:13.917104+00', NULL, '59be3fac-dd89-4dd0-a445-bd9de0b7403c');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: organizations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."organizations" ("id", "slug", "name", "description", "icon_url", "created_by", "created_at", "updated_at") VALUES
	('617e8e18-a67e-4b17-988d-ca0668a1198f', 'accessly', 'accessly', 'access management for agile teams', NULL, '041eb9c5-372a-469b-af75-825cd34b7e2d', '2025-09-21 15:23:29.678197+00', '2025-09-21 15:23:29.678197+00');


--
-- Data for Name: boards; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: board_members; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_profiles" ("full_name", "avatar_url", "created_at", "updated_at", "email", "user_id") VALUES
	('test', NULL, '2025-09-21 15:22:46.974272+00', '2025-09-21 15:22:46.974272+00', 'test@test.com', '041eb9c5-372a-469b-af75-825cd34b7e2d');


--
-- Data for Name: invites; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: organization_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."organization_members" ("user_id", "organization_id", "role", "joined_at", "last_active_at", "created_at", "updated_at") VALUES
	('041eb9c5-372a-469b-af75-825cd34b7e2d', '617e8e18-a67e-4b17-988d-ca0668a1198f', 'admin', '2025-09-21 15:23:29.678197+00', NULL, '2025-09-21 15:23:29.678197+00', '2025-09-21 15:23:29.678197+00');


--
-- Data for Name: user_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_settings" ("theme", "language", "notifications_enabled", "created_at", "updated_at", "user_id") VALUES
	('system', 'en', true, '2025-09-21 15:22:46.974272+00', '2025-09-21 15:22:46.974272+00', '041eb9c5-372a-469b-af75-825cd34b7e2d') on conflict do nothing;


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('avatars', 'avatars', NULL, '2025-09-21 15:21:47.842888+00', '2025-09-21 15:21:47.842888+00', true, false, NULL, NULL, NULL) on conflict do nothing;


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
