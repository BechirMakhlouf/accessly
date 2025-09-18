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
	('00000000-0000-0000-0000-000000000000', '1d4de3eb-376d-4720-8820-692c5df6e52a', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"test@test.com","user_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","user_phone":""}}', '2025-09-17 13:04:06.465971+00', ''),
	('00000000-0000-0000-0000-000000000000', '81c51c21-1c2b-416a-a8bd-31b05faef92c', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"test2@test.com","user_id":"0084f45a-dfe5-4325-8c27-96b84dbf0214","user_phone":""}}', '2025-09-17 13:08:18.989418+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ee7ed724-7cc6-4318-a245-d48f2a32accb', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"test3@test.com","user_id":"11ce7686-d71f-40d0-b00d-f9a9c32e8324","user_phone":""}}', '2025-09-17 13:08:30.290424+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ee342205-9449-42d2-ace1-607e92802ff0', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"test4@test.com","user_id":"a127c649-826a-4139-8886-385175c319be","user_phone":""}}', '2025-09-17 13:08:42.667077+00', ''),
	('00000000-0000-0000-0000-000000000000', '613aa5cd-b81f-4abf-ad4a-d27418976d8d', '{"action":"user_recovery_requested","actor_id":"a127c649-826a-4139-8886-385175c319be","actor_username":"test4@test.com","actor_via_sso":false,"log_type":"user"}', '2025-09-17 13:22:46.373083+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ab169c75-3178-4ef4-8d52-e37af0e23c0b', '{"action":"login","actor_id":"a127c649-826a-4139-8886-385175c319be","actor_username":"test4@test.com","actor_via_sso":false,"log_type":"account"}', '2025-09-17 13:23:09.428382+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ec9d919b-24ec-45b8-b66d-cc881273eae6', '{"action":"user_updated_password","actor_id":"a127c649-826a-4139-8886-385175c319be","actor_username":"test4@test.com","actor_via_sso":false,"log_type":"user"}', '2025-09-17 13:23:17.319742+00', ''),
	('00000000-0000-0000-0000-000000000000', '19db9081-cd84-4bc1-a8da-6dd6c7f665ea', '{"action":"user_modified","actor_id":"a127c649-826a-4139-8886-385175c319be","actor_username":"test4@test.com","actor_via_sso":false,"log_type":"user"}', '2025-09-17 13:23:17.320018+00', ''),
	('00000000-0000-0000-0000-000000000000', '63a13d4f-dceb-473c-acbb-ff822546be4f', '{"action":"user_recovery_requested","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"user"}', '2025-09-17 13:24:53.887181+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bb591bfb-001b-4980-a7cc-f646b6dfac1e', '{"action":"login","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account"}', '2025-09-17 13:24:57.514991+00', ''),
	('00000000-0000-0000-0000-000000000000', '8420780f-b3b1-486f-9324-3f8b8a0fc53b', '{"action":"user_updated_password","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"user"}', '2025-09-17 13:25:05.112467+00', ''),
	('00000000-0000-0000-0000-000000000000', '05365983-a8ad-4c32-bea3-f98c880e64cd', '{"action":"user_modified","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"user"}', '2025-09-17 13:25:05.112869+00', ''),
	('00000000-0000-0000-0000-000000000000', '6f62e6af-7838-46e8-b9ee-e36702933689', '{"action":"user_recovery_requested","actor_id":"0084f45a-dfe5-4325-8c27-96b84dbf0214","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"user"}', '2025-09-17 13:25:18.761692+00', ''),
	('00000000-0000-0000-0000-000000000000', '233a97bd-f3ae-459b-944f-dda2b14b2ceb', '{"action":"login","actor_id":"0084f45a-dfe5-4325-8c27-96b84dbf0214","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"account"}', '2025-09-17 13:25:22.500946+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c27d448a-e6d8-4b0d-893c-7586753ea6d6', '{"action":"user_updated_password","actor_id":"0084f45a-dfe5-4325-8c27-96b84dbf0214","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"user"}', '2025-09-17 13:25:28.170738+00', ''),
	('00000000-0000-0000-0000-000000000000', '1eba90b9-6445-499e-8436-8d132d8e2be1', '{"action":"user_modified","actor_id":"0084f45a-dfe5-4325-8c27-96b84dbf0214","actor_username":"test2@test.com","actor_via_sso":false,"log_type":"user"}', '2025-09-17 13:25:28.171009+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ca0691eb-f8a1-455e-9c4d-e44ff7cf4a0f', '{"action":"user_recovery_requested","actor_id":"11ce7686-d71f-40d0-b00d-f9a9c32e8324","actor_username":"test3@test.com","actor_via_sso":false,"log_type":"user"}', '2025-09-17 13:25:43.340736+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bd742456-3b28-4ba9-9306-c01337e9e578', '{"action":"login","actor_id":"11ce7686-d71f-40d0-b00d-f9a9c32e8324","actor_username":"test3@test.com","actor_via_sso":false,"log_type":"account"}', '2025-09-17 13:25:49.761189+00', ''),
	('00000000-0000-0000-0000-000000000000', '22e3ddc8-1f24-4e0d-be39-8999273f9ede', '{"action":"user_updated_password","actor_id":"11ce7686-d71f-40d0-b00d-f9a9c32e8324","actor_username":"test3@test.com","actor_via_sso":false,"log_type":"user"}', '2025-09-17 13:25:56.803419+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b2eb989a-efda-4abf-a22e-e8eec6dd2248', '{"action":"user_modified","actor_id":"11ce7686-d71f-40d0-b00d-f9a9c32e8324","actor_username":"test3@test.com","actor_via_sso":false,"log_type":"user"}', '2025-09-17 13:25:56.803713+00', ''),
	('00000000-0000-0000-0000-000000000000', '5c6d8c65-e138-4239-8e7d-b20e17066ef4', '{"action":"logout","actor_id":"11ce7686-d71f-40d0-b00d-f9a9c32e8324","actor_username":"test3@test.com","actor_via_sso":false,"log_type":"account"}', '2025-09-17 13:26:00.655251+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dc79e998-8bf5-4581-b214-412ce9d8dcd2', '{"action":"login","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-18 11:01:10.147012+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e0b93208-2d5f-4ac5-9db1-6a1ff1654040', '{"action":"login","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-18 11:01:22.465632+00', ''),
	('00000000-0000-0000-0000-000000000000', '4356bb12-6172-4020-a5ff-d3c1ec27d2f9', '{"action":"login","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-18 11:01:31.452865+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ab75bf44-e73c-48b4-9ebe-f282758e49dd', '{"action":"login","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-18 11:22:55.614182+00', ''),
	('00000000-0000-0000-0000-000000000000', '9009c348-7762-4088-a283-3b0cb2f14fb1', '{"action":"token_refreshed","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 11:59:42.677596+00', ''),
	('00000000-0000-0000-0000-000000000000', '85e75af4-cb65-451f-9710-9ca53f294456', '{"action":"token_revoked","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 11:59:42.67942+00', ''),
	('00000000-0000-0000-0000-000000000000', '0307c545-5db5-458f-af63-0428a9c8c709', '{"action":"token_refreshed","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 12:21:05.978043+00', ''),
	('00000000-0000-0000-0000-000000000000', '0db1262e-8a81-4111-ad9b-d7d8529cd2a6', '{"action":"token_revoked","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 12:21:05.97844+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a65940eb-6cf7-466e-ba9f-ed6ade8e3385', '{"action":"token_refreshed","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 13:02:10.956084+00', ''),
	('00000000-0000-0000-0000-000000000000', '7cf1a3b1-b350-4716-a2d6-380451c36555', '{"action":"token_revoked","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 13:02:10.957945+00', ''),
	('00000000-0000-0000-0000-000000000000', '5285f8ac-cfe1-4aa1-b336-5b77bf6e4819', '{"action":"token_refreshed","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 13:02:10.985781+00', ''),
	('00000000-0000-0000-0000-000000000000', '22d7fa48-fbb4-43ca-84f7-194235be2f37', '{"action":"token_refreshed","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 13:02:13.167454+00', ''),
	('00000000-0000-0000-0000-000000000000', 'becc777f-250b-45e4-a930-ff8e742ccaba', '{"action":"token_refreshed","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 13:02:13.178334+00', ''),
	('00000000-0000-0000-0000-000000000000', '4aaadac1-eeeb-47f8-817a-ffb181dbc769', '{"action":"token_refreshed","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 13:02:13.190589+00', ''),
	('00000000-0000-0000-0000-000000000000', '25761e53-5f61-454a-bc42-63076f4164aa', '{"action":"token_refreshed","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 13:02:13.362684+00', ''),
	('00000000-0000-0000-0000-000000000000', '6f143efa-3cf0-46f5-b7cc-3e59eb05a639', '{"action":"token_refreshed","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 13:02:13.389676+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e12975ae-8e06-4d47-a7e0-59f33e4d7819', '{"action":"token_refreshed","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 13:02:13.983007+00', ''),
	('00000000-0000-0000-0000-000000000000', '30859a33-60c5-4801-909f-fc8ca08cb3e3', '{"action":"token_refreshed","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 13:02:14.146068+00', ''),
	('00000000-0000-0000-0000-000000000000', '38250450-a109-4c12-8b1a-3303d3e43dff', '{"action":"token_refreshed","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 13:02:14.181559+00', ''),
	('00000000-0000-0000-0000-000000000000', '6d49f547-26f0-4a52-af1c-020fad498f44', '{"action":"token_refreshed","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 13:02:14.493884+00', ''),
	('00000000-0000-0000-0000-000000000000', '69d4763b-4083-4cf3-87bb-0eea35177256', '{"action":"token_refreshed","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 13:02:14.519429+00', ''),
	('00000000-0000-0000-0000-000000000000', '8c86954a-0079-4d9c-a427-1ac7d2e4626d', '{"action":"token_refreshed","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 14:04:58.516606+00', ''),
	('00000000-0000-0000-0000-000000000000', '02b646b6-26ff-4d82-8ea9-a4a3457640e5', '{"action":"token_revoked","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 14:04:58.518184+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ee5a4b12-e280-4403-ac63-5db113d29213', '{"action":"token_refreshed","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 14:04:58.543193+00', ''),
	('00000000-0000-0000-0000-000000000000', '56ae84c2-0dcc-45a5-b1db-06a101598943', '{"action":"token_refreshed","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 15:03:47.90399+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dd6928b3-4e40-4b45-8c34-928874d36296', '{"action":"token_revoked","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 15:03:47.904616+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bedb936e-4e5d-4145-80cf-ff55c30ac140', '{"action":"token_refreshed","actor_id":"d4d9761c-8c24-4b5f-915b-57fa602f1abd","actor_username":"test@test.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 15:03:47.92276+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '11ce7686-d71f-40d0-b00d-f9a9c32e8324', 'authenticated', 'authenticated', 'test3@test.com', '$2a$10$MT/Cl5Sa0S4lhEuCE5PDuusu6L32yTtOMSwFgtPU8NtCJXJ.MVVkG', '2025-09-17 13:08:30.291113+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-09-17 13:25:49.762178+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-17 13:08:30.288564+00', '2025-09-17 13:25:56.802664+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'a127c649-826a-4139-8886-385175c319be', 'authenticated', 'authenticated', 'test4@test.com', '$2a$10$9Y9Guz1FOFp8fGYEin9Snuig5Rzv.gP8TQ3JkODlfKNscZnC0mDk2', '2025-09-17 13:08:42.667875+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-09-17 13:23:09.429664+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-17 13:08:42.665168+00', '2025-09-17 13:23:17.318754+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '0084f45a-dfe5-4325-8c27-96b84dbf0214', 'authenticated', 'authenticated', 'test2@test.com', '$2a$10$SAwdYXu8JnL6K9StDlcKQe1pPZIBdqZM86OqAbG7vuDxtwcSm1vV6', '2025-09-17 13:08:18.990373+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-09-17 13:25:22.502028+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-17 13:08:18.987069+00', '2025-09-17 13:25:28.170181+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'd4d9761c-8c24-4b5f-915b-57fa602f1abd', 'authenticated', 'authenticated', 'test@test.com', '$2a$10$a2DaU2EYkgY632KK.Ey7EeGzFKrbD04nMuqms/cqqaKlwm9JEAe12', '2025-09-17 13:04:06.468721+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-09-18 11:22:55.614637+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-17 13:04:06.461768+00', '2025-09-18 15:03:47.906153+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('d4d9761c-8c24-4b5f-915b-57fa602f1abd', 'd4d9761c-8c24-4b5f-915b-57fa602f1abd', '{"sub": "d4d9761c-8c24-4b5f-915b-57fa602f1abd", "email": "test@test.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-17 13:04:06.465142+00', '2025-09-17 13:04:06.465181+00', '2025-09-17 13:04:06.465181+00', '007cebad-e288-41b0-896f-8f2584f86d46'),
	('0084f45a-dfe5-4325-8c27-96b84dbf0214', '0084f45a-dfe5-4325-8c27-96b84dbf0214', '{"sub": "0084f45a-dfe5-4325-8c27-96b84dbf0214", "email": "test2@test.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-17 13:08:18.988608+00', '2025-09-17 13:08:18.988645+00', '2025-09-17 13:08:18.988645+00', '1ca56d11-4472-4af0-9f67-1405095aca33'),
	('11ce7686-d71f-40d0-b00d-f9a9c32e8324', '11ce7686-d71f-40d0-b00d-f9a9c32e8324', '{"sub": "11ce7686-d71f-40d0-b00d-f9a9c32e8324", "email": "test3@test.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-17 13:08:30.289765+00', '2025-09-17 13:08:30.289793+00', '2025-09-17 13:08:30.289793+00', '84ebf23c-6d2e-40f4-8655-74bbf21b7d58'),
	('a127c649-826a-4139-8886-385175c319be', 'a127c649-826a-4139-8886-385175c319be', '{"sub": "a127c649-826a-4139-8886-385175c319be", "email": "test4@test.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-17 13:08:42.666381+00', '2025-09-17 13:08:42.666413+00', '2025-09-17 13:08:42.666413+00', '042484cf-436f-4e25-bf7b-0be8c419c53d');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('75d157c5-2471-464f-879d-d81d11d910b9', 'a127c649-826a-4139-8886-385175c319be', '2025-09-17 13:23:09.429709+00', '2025-09-17 13:23:09.429709+00', NULL, 'aal1', NULL, NULL, 'node', '172.27.0.1', NULL),
	('2ddfe1a7-1553-4242-bf71-7a48d67fcd80', 'd4d9761c-8c24-4b5f-915b-57fa602f1abd', '2025-09-17 13:24:57.516107+00', '2025-09-17 13:24:57.516107+00', NULL, 'aal1', NULL, NULL, 'node', '172.27.0.1', NULL),
	('b9593baa-b38f-4550-825b-3095b0ea7506', '0084f45a-dfe5-4325-8c27-96b84dbf0214', '2025-09-17 13:25:22.502059+00', '2025-09-17 13:25:22.502059+00', NULL, 'aal1', NULL, NULL, 'node', '172.27.0.1', NULL),
	('a099ca6d-7923-4503-8b80-2abd386dffd1', 'd4d9761c-8c24-4b5f-915b-57fa602f1abd', '2025-09-18 11:01:10.148096+00', '2025-09-18 11:01:10.148096+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '172.27.0.1', NULL),
	('ab66b578-f03f-4f12-a3d7-b1596f24c405', 'd4d9761c-8c24-4b5f-915b-57fa602f1abd', '2025-09-18 11:01:22.466127+00', '2025-09-18 11:01:22.466127+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '172.27.0.1', NULL),
	('5294458c-a8f0-4dde-93f1-09fd4aab13d4', 'd4d9761c-8c24-4b5f-915b-57fa602f1abd', '2025-09-18 11:22:55.614682+00', '2025-09-18 12:21:05.980758+00', NULL, 'aal1', NULL, '2025-09-18 12:21:05.980722', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '172.27.0.1', NULL),
	('41d1e483-1604-4e15-933e-0318a3591a65', 'd4d9761c-8c24-4b5f-915b-57fa602f1abd', '2025-09-18 11:01:31.453398+00', '2025-09-18 15:03:47.92338+00', NULL, 'aal1', NULL, '2025-09-18 15:03:47.923341', 'Next.js Middleware', '172.27.0.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('75d157c5-2471-464f-879d-d81d11d910b9', '2025-09-17 13:23:09.433675+00', '2025-09-17 13:23:09.433675+00', 'otp', '0346cc40-f460-441f-a166-da43f059c595'),
	('2ddfe1a7-1553-4242-bf71-7a48d67fcd80', '2025-09-17 13:24:57.517127+00', '2025-09-17 13:24:57.517127+00', 'otp', '76998c5d-ba71-4d73-900a-551f841c0ef1'),
	('b9593baa-b38f-4550-825b-3095b0ea7506', '2025-09-17 13:25:22.503182+00', '2025-09-17 13:25:22.503182+00', 'otp', 'ab0b09ff-d0dd-433e-94f3-5b0a07a2c3ee'),
	('a099ca6d-7923-4503-8b80-2abd386dffd1', '2025-09-18 11:01:10.151206+00', '2025-09-18 11:01:10.151206+00', 'password', '704c8960-2040-4d66-8654-a3b85ee60787'),
	('ab66b578-f03f-4f12-a3d7-b1596f24c405', '2025-09-18 11:01:22.467407+00', '2025-09-18 11:01:22.467407+00', 'password', '56f15928-defc-411c-8a2f-3730aa81bbd7'),
	('41d1e483-1604-4e15-933e-0318a3591a65', '2025-09-18 11:01:31.454464+00', '2025-09-18 11:01:31.454464+00', 'password', '37d8cdcb-0683-46c0-bc99-6d30283da8e1'),
	('5294458c-a8f0-4dde-93f1-09fd4aab13d4', '2025-09-18 11:22:55.616377+00', '2025-09-18 11:22:55.616377+00', 'password', 'fb7f8b93-f0e6-42bc-8c78-0ca444dd5fbf');


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
	('00000000-0000-0000-0000-000000000000', 1, 'codt55oy3vd6', 'a127c649-826a-4139-8886-385175c319be', false, '2025-09-17 13:23:09.431563+00', '2025-09-17 13:23:09.431563+00', NULL, '75d157c5-2471-464f-879d-d81d11d910b9'),
	('00000000-0000-0000-0000-000000000000', 2, 'kverxucg3ize', 'd4d9761c-8c24-4b5f-915b-57fa602f1abd', false, '2025-09-17 13:24:57.516524+00', '2025-09-17 13:24:57.516524+00', NULL, '2ddfe1a7-1553-4242-bf71-7a48d67fcd80'),
	('00000000-0000-0000-0000-000000000000', 3, 'h3hziyp2trgu', '0084f45a-dfe5-4325-8c27-96b84dbf0214', false, '2025-09-17 13:25:22.502459+00', '2025-09-17 13:25:22.502459+00', NULL, 'b9593baa-b38f-4550-825b-3095b0ea7506'),
	('00000000-0000-0000-0000-000000000000', 5, 'e4ouqsmp4jsy', 'd4d9761c-8c24-4b5f-915b-57fa602f1abd', false, '2025-09-18 11:01:10.149622+00', '2025-09-18 11:01:10.149622+00', NULL, 'a099ca6d-7923-4503-8b80-2abd386dffd1'),
	('00000000-0000-0000-0000-000000000000', 6, 'ke7cjee5rb4x', 'd4d9761c-8c24-4b5f-915b-57fa602f1abd', false, '2025-09-18 11:01:22.466632+00', '2025-09-18 11:01:22.466632+00', NULL, 'ab66b578-f03f-4f12-a3d7-b1596f24c405'),
	('00000000-0000-0000-0000-000000000000', 7, 'nbicjkjh3xwv', 'd4d9761c-8c24-4b5f-915b-57fa602f1abd', true, '2025-09-18 11:01:31.453809+00', '2025-09-18 11:59:42.679843+00', NULL, '41d1e483-1604-4e15-933e-0318a3591a65'),
	('00000000-0000-0000-0000-000000000000', 8, 'p7524kdjsn7l', 'd4d9761c-8c24-4b5f-915b-57fa602f1abd', true, '2025-09-18 11:22:55.615457+00', '2025-09-18 12:21:05.978692+00', NULL, '5294458c-a8f0-4dde-93f1-09fd4aab13d4'),
	('00000000-0000-0000-0000-000000000000', 10, 'v2ewoze3yuwy', 'd4d9761c-8c24-4b5f-915b-57fa602f1abd', false, '2025-09-18 12:21:05.979357+00', '2025-09-18 12:21:05.979357+00', 'p7524kdjsn7l', '5294458c-a8f0-4dde-93f1-09fd4aab13d4'),
	('00000000-0000-0000-0000-000000000000', 9, 'h6xq6qmxqkqk', 'd4d9761c-8c24-4b5f-915b-57fa602f1abd', true, '2025-09-18 11:59:42.680962+00', '2025-09-18 13:02:10.958195+00', 'nbicjkjh3xwv', '41d1e483-1604-4e15-933e-0318a3591a65'),
	('00000000-0000-0000-0000-000000000000', 11, '3iqtjkzw7z4t', 'd4d9761c-8c24-4b5f-915b-57fa602f1abd', true, '2025-09-18 13:02:10.959441+00', '2025-09-18 14:04:58.518464+00', 'h6xq6qmxqkqk', '41d1e483-1604-4e15-933e-0318a3591a65'),
	('00000000-0000-0000-0000-000000000000', 12, 'owabs567w2wj', 'd4d9761c-8c24-4b5f-915b-57fa602f1abd', true, '2025-09-18 14:04:58.518875+00', '2025-09-18 15:03:47.904942+00', '3iqtjkzw7z4t', '41d1e483-1604-4e15-933e-0318a3591a65'),
	('00000000-0000-0000-0000-000000000000', 13, '76ynyu2xkd6h', 'd4d9761c-8c24-4b5f-915b-57fa602f1abd', false, '2025-09-18 15:03:47.905398+00', '2025-09-18 15:03:47.905398+00', 'owabs567w2wj', '41d1e483-1604-4e15-933e-0318a3591a65');


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
	('cd41f192-7501-4ec9-9b5d-05609bce30d5', 'test-org', 'test org', 'test org', NULL, 'd4d9761c-8c24-4b5f-915b-57fa602f1abd', '2025-09-17 13:09:40.835418+00', '2025-09-17 13:09:40.835418+00'),
	('3199af3b-4fd9-4cb4-9028-8a8a46ce8c3b', 'org-2', 'org 2', NULL, NULL, 'd4d9761c-8c24-4b5f-915b-57fa602f1abd', '2025-09-18 11:39:53.103231+00', '2025-09-18 11:39:53.103231+00');


--
-- Data for Name: boards; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."boards" ("id", "organization_id", "title", "description", "icon_url", "visibility", "created_by", "created_at", "updated_at", "slug") VALUES
	('630dd5d8-8d94-4e94-b6ef-c600f00bf72a', 'cd41f192-7501-4ec9-9b5d-05609bce30d5', 'test private board', NULL, NULL, 'private', 'd4d9761c-8c24-4b5f-915b-57fa602f1abd', '2025-09-17 13:12:18.882266+00', '2025-09-17 13:12:18.882266+00', 'test-private-board'),
	('5656b0af-56e9-48a3-9d53-6619592fc2dd', 'cd41f192-7501-4ec9-9b5d-05609bce30d5', 'test public board', NULL, NULL, 'public', '0084f45a-dfe5-4325-8c27-96b84dbf0214', '2025-09-17 13:12:51.542328+00', '2025-09-17 13:12:51.542328+00', 'test-public-board');


--
-- Data for Name: board_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."board_members" ("user_id", "board_id", "role", "joined_at", "created_at", "updated_at") VALUES
	('d4d9761c-8c24-4b5f-915b-57fa602f1abd', '630dd5d8-8d94-4e94-b6ef-c600f00bf72a', 'admin', '2025-09-17 13:12:18.882266+00', '2025-09-17 13:12:18.882266+00', '2025-09-17 13:12:18.882266+00'),
	('0084f45a-dfe5-4325-8c27-96b84dbf0214', '5656b0af-56e9-48a3-9d53-6619592fc2dd', 'admin', '2025-09-17 13:12:51.542328+00', '2025-09-17 13:12:51.542328+00', '2025-09-17 13:12:51.542328+00'),
	('11ce7686-d71f-40d0-b00d-f9a9c32e8324', '630dd5d8-8d94-4e94-b6ef-c600f00bf72a', 'member', '2025-09-17 13:13:34.560952+00', '2025-09-17 13:13:34.560952+00', '2025-09-17 13:13:34.560952+00');


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_profiles" ("full_name", "avatar_url", "created_at", "updated_at", "email", "user_id") VALUES
	('test', NULL, '2025-09-17 13:04:06.461499+00', '2025-09-17 13:04:06.461499+00', 'test@test.com', 'd4d9761c-8c24-4b5f-915b-57fa602f1abd'),
	('test2', NULL, '2025-09-17 13:08:18.986859+00', '2025-09-17 13:08:18.986859+00', 'test2@test.com', '0084f45a-dfe5-4325-8c27-96b84dbf0214'),
	('test3', NULL, '2025-09-17 13:08:30.288276+00', '2025-09-17 13:08:30.288276+00', 'test3@test.com', '11ce7686-d71f-40d0-b00d-f9a9c32e8324'),
	('test4', NULL, '2025-09-17 13:08:42.664934+00', '2025-09-17 13:08:42.664934+00', 'test4@test.com', 'a127c649-826a-4139-8886-385175c319be');


--
-- Data for Name: invites; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: organization_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."organization_members" ("user_id", "organization_id", "role", "joined_at", "last_active_at", "created_at", "updated_at") VALUES
	('d4d9761c-8c24-4b5f-915b-57fa602f1abd', 'cd41f192-7501-4ec9-9b5d-05609bce30d5', 'admin', '2025-09-17 13:09:40.835418+00', NULL, '2025-09-17 13:09:40.835418+00', '2025-09-17 13:09:40.835418+00'),
	('0084f45a-dfe5-4325-8c27-96b84dbf0214', 'cd41f192-7501-4ec9-9b5d-05609bce30d5', 'admin', '2025-09-17 13:10:36.061831+00', NULL, '2025-09-17 13:10:36.061831+00', '2025-09-17 13:10:36.061831+00'),
	('11ce7686-d71f-40d0-b00d-f9a9c32e8324', 'cd41f192-7501-4ec9-9b5d-05609bce30d5', 'member', '2025-09-17 13:11:09.604679+00', NULL, '2025-09-17 13:11:09.604679+00', '2025-09-17 13:11:09.604679+00'),
	('a127c649-826a-4139-8886-385175c319be', 'cd41f192-7501-4ec9-9b5d-05609bce30d5', 'member', '2025-09-17 13:11:39.603568+00', NULL, '2025-09-17 13:11:39.603568+00', '2025-09-17 13:11:39.603568+00'),
	('d4d9761c-8c24-4b5f-915b-57fa602f1abd', '3199af3b-4fd9-4cb4-9028-8a8a46ce8c3b', 'admin', '2025-09-18 11:39:53.103231+00', NULL, '2025-09-18 11:39:53.103231+00', '2025-09-18 11:39:53.103231+00');


--
-- Data for Name: user_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_settings" ("theme", "language", "notifications_enabled", "created_at", "updated_at", "user_id") VALUES
	('system', 'en', true, '2025-09-17 13:08:18.986859+00', '2025-09-17 13:08:18.986859+00', '0084f45a-dfe5-4325-8c27-96b84dbf0214'),
	('system', 'en', true, '2025-09-17 13:08:30.288276+00', '2025-09-17 13:08:30.288276+00', '11ce7686-d71f-40d0-b00d-f9a9c32e8324'),
	('system', 'en', true, '2025-09-17 13:08:42.664934+00', '2025-09-17 13:08:42.664934+00', 'a127c649-826a-4139-8886-385175c319be'),
	('light', 'en', true, '2025-09-17 13:04:06.461499+00', '2025-09-18 14:08:41.046656+00', 'd4d9761c-8c24-4b5f-915b-57fa602f1abd');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('avatars', 'avatars', NULL, '2025-09-18 08:11:51.600176+00', '2025-09-18 08:11:51.600176+00', true, false, NULL, NULL, NULL);


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

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 13, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
