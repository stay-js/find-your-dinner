--
-- PostgreSQL database dump
--

\restrict uHoqnIZwb0Bmx5i6PavS3y1WkO2kCJE10eMBZcqvODdNE5yd3UjwbveAk7dmKvb

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

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
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO postgres;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: postgres
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO postgres;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: postgres
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNER TO postgres;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: postgres
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    user_id character varying(256) NOT NULL
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id bigint NOT NULL,
    name character varying(128) NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.categories ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: category_recipe; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category_recipe (
    category_id bigint NOT NULL,
    recipe_id bigint NOT NULL
);


ALTER TABLE public.category_recipe OWNER TO postgres;

--
-- Name: default_ingredients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.default_ingredients (
    user_id character varying(256) NOT NULL,
    ingredient_id bigint NOT NULL
);


ALTER TABLE public.default_ingredients OWNER TO postgres;

--
-- Name: ingredient_recipe_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ingredient_recipe_data (
    ingredient_id bigint NOT NULL,
    recipe_data_id bigint NOT NULL,
    unit_id bigint NOT NULL,
    quantity double precision NOT NULL
);


ALTER TABLE public.ingredient_recipe_data OWNER TO postgres;

--
-- Name: ingredients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ingredients (
    id bigint NOT NULL,
    name character varying(256) NOT NULL
);


ALTER TABLE public.ingredients OWNER TO postgres;

--
-- Name: ingredients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.ingredients ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.ingredients_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: recipe_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recipe_data (
    id bigint NOT NULL,
    recipe_id bigint NOT NULL,
    title character varying(512) NOT NULL,
    description text NOT NULL,
    instructions text NOT NULL,
    preview_image_url character varying(2048) NOT NULL,
    cook_time_minutes integer NOT NULL,
    prep_time_minutes integer NOT NULL,
    servings integer NOT NULL,
    verified boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.recipe_data OWNER TO postgres;

--
-- Name: recipe_data_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.recipe_data ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.recipe_data_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: recipes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recipes (
    id bigint NOT NULL,
    user_id character varying(256) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.recipes OWNER TO postgres;

--
-- Name: recipes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.recipes ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.recipes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: saved_recipes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.saved_recipes (
    recipe_id bigint NOT NULL,
    user_id character varying(256) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.saved_recipes OWNER TO postgres;

--
-- Name: units; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.units (
    id bigint NOT NULL,
    abbreviation character varying(16) NOT NULL,
    name character varying(64) NOT NULL
);


ALTER TABLE public.units OWNER TO postgres;

--
-- Name: units_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.units ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.units_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: postgres
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: postgres
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
1	8739473dabfd29a072ad0294b52900f24ef2e38f39db3efa37e01f4deba8e756	1775661284804
2	43ef0ffd236add296dc107d6cc6ff92d11da40a592a2520e28ee3dfc31ed5266	1775765914241
3	3bffecce3c66f7194b13c9d0007d7665ef7bc6a3b70778cada31bf153a06c5b8	1776680776526
\.


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (user_id) FROM stdin;
user_38bzMM6AVsxkk7dJNc7n4GLSkDm
user_3CCx7CfdpF5IWcdjVb0DmpUppw5
user_3CG6nCYzPeHOgYIZg6oajghAz5e
user_3Cm3T3nUIHBLUQdHb4LbyNZnHvW
user_3CPCdO9xP7lG2xuj7xsd466sLdd
user_3CPE4WILkIU2vrqElJNKDPZ2GsH
user_3CQ7B3EpNA02PTL6nI7OmCsrEMA
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name) FROM stdin;
1	Reggeli
2	Tízórai/Snack
3	Leves
4	Előétel
5	Főétel
6	Saláta
7	Köret
8	Desszert
9	Szendvics/Wrap
\.


--
-- Data for Name: category_recipe; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category_recipe (category_id, recipe_id) FROM stdin;
2	1
8	2
8	3
6	4
7	4
1	5
2	5
1	6
2	6
4	6
5	6
7	7
4	8
5	8
6	8
9	8
9	9
2	9
6	9
4	9
5	10
4	11
7	11
6	11
\.


--
-- Data for Name: default_ingredients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.default_ingredients (user_id, ingredient_id) FROM stdin;
user_3Clo0wtsXPon7mNlAazTciKb0Lv	1
user_3Clo0wtsXPon7mNlAazTciKb0Lv	2
user_3Clo0wtsXPon7mNlAazTciKb0Lv	3
user_3Clo0wtsXPon7mNlAazTciKb0Lv	4
user_3Clo0wtsXPon7mNlAazTciKb0Lv	5
user_3Clo0wtsXPon7mNlAazTciKb0Lv	6
user_3Clo0wtsXPon7mNlAazTciKb0Lv	7
user_3Clo0wtsXPon7mNlAazTciKb0Lv	8
user_3Clo0wtsXPon7mNlAazTciKb0Lv	9
user_3Clo0wtsXPon7mNlAazTciKb0Lv	10
user_3Clo0wtsXPon7mNlAazTciKb0Lv	11
user_3Clo0wtsXPon7mNlAazTciKb0Lv	12
user_3Clo0wtsXPon7mNlAazTciKb0Lv	13
user_3Clo0wtsXPon7mNlAazTciKb0Lv	14
user_3Clo0wtsXPon7mNlAazTciKb0Lv	15
user_3Clo0wtsXPon7mNlAazTciKb0Lv	16
user_3Clo0wtsXPon7mNlAazTciKb0Lv	17
user_3Clo0wtsXPon7mNlAazTciKb0Lv	18
user_3Clo0wtsXPon7mNlAazTciKb0Lv	19
user_3Clo0wtsXPon7mNlAazTciKb0Lv	20
user_3Clo0wtsXPon7mNlAazTciKb0Lv	21
user_3Clo0wtsXPon7mNlAazTciKb0Lv	22
user_3Clo0wtsXPon7mNlAazTciKb0Lv	23
user_3Clo0wtsXPon7mNlAazTciKb0Lv	24
user_3Clo0wtsXPon7mNlAazTciKb0Lv	25
user_3Clo0wtsXPon7mNlAazTciKb0Lv	26
user_3Clo0wtsXPon7mNlAazTciKb0Lv	27
user_3Clo0wtsXPon7mNlAazTciKb0Lv	28
user_3Clo0wtsXPon7mNlAazTciKb0Lv	29
user_3Clo0wtsXPon7mNlAazTciKb0Lv	30
user_3Clo0wtsXPon7mNlAazTciKb0Lv	31
user_3Clo0wtsXPon7mNlAazTciKb0Lv	32
user_3Clo0wtsXPon7mNlAazTciKb0Lv	33
user_3Clo0wtsXPon7mNlAazTciKb0Lv	34
user_3Clo0wtsXPon7mNlAazTciKb0Lv	35
user_3Clo0wtsXPon7mNlAazTciKb0Lv	36
user_3Clo0wtsXPon7mNlAazTciKb0Lv	37
user_3Clo0wtsXPon7mNlAazTciKb0Lv	38
user_3Clo0wtsXPon7mNlAazTciKb0Lv	39
user_3Clo0wtsXPon7mNlAazTciKb0Lv	40
user_3Clo0wtsXPon7mNlAazTciKb0Lv	41
user_3Clo0wtsXPon7mNlAazTciKb0Lv	42
user_3Clo0wtsXPon7mNlAazTciKb0Lv	43
user_3Clo0wtsXPon7mNlAazTciKb0Lv	44
user_3Clo0wtsXPon7mNlAazTciKb0Lv	45
user_3Clo0wtsXPon7mNlAazTciKb0Lv	46
user_3Clo0wtsXPon7mNlAazTciKb0Lv	47
user_3Clo0wtsXPon7mNlAazTciKb0Lv	48
user_3Clo0wtsXPon7mNlAazTciKb0Lv	49
user_3Clo0wtsXPon7mNlAazTciKb0Lv	50
user_3Clo0wtsXPon7mNlAazTciKb0Lv	51
user_3Clo0wtsXPon7mNlAazTciKb0Lv	52
user_3Clo0wtsXPon7mNlAazTciKb0Lv	53
user_3Clo0wtsXPon7mNlAazTciKb0Lv	54
user_3Clo0wtsXPon7mNlAazTciKb0Lv	55
user_3Clo0wtsXPon7mNlAazTciKb0Lv	56
user_3Clo0wtsXPon7mNlAazTciKb0Lv	57
user_3Clo0wtsXPon7mNlAazTciKb0Lv	58
user_3Clo0wtsXPon7mNlAazTciKb0Lv	59
user_3Clo0wtsXPon7mNlAazTciKb0Lv	60
user_3Clo0wtsXPon7mNlAazTciKb0Lv	61
user_3Clo0wtsXPon7mNlAazTciKb0Lv	62
user_3Clo0wtsXPon7mNlAazTciKb0Lv	63
user_3Clo0wtsXPon7mNlAazTciKb0Lv	64
user_3Clo0wtsXPon7mNlAazTciKb0Lv	65
user_3Clo0wtsXPon7mNlAazTciKb0Lv	66
user_3Clo0wtsXPon7mNlAazTciKb0Lv	67
user_3Clo0wtsXPon7mNlAazTciKb0Lv	68
user_3Clo0wtsXPon7mNlAazTciKb0Lv	69
user_3Clo0wtsXPon7mNlAazTciKb0Lv	70
user_3Clo0wtsXPon7mNlAazTciKb0Lv	71
user_3Clo0wtsXPon7mNlAazTciKb0Lv	72
user_3Clo0wtsXPon7mNlAazTciKb0Lv	73
user_3Clo0wtsXPon7mNlAazTciKb0Lv	74
user_3Clo0wtsXPon7mNlAazTciKb0Lv	75
user_3Clo0wtsXPon7mNlAazTciKb0Lv	76
user_3Clo0wtsXPon7mNlAazTciKb0Lv	77
user_3Clo0wtsXPon7mNlAazTciKb0Lv	78
user_3Clo0wtsXPon7mNlAazTciKb0Lv	79
user_3Clo0wtsXPon7mNlAazTciKb0Lv	80
user_3Clo0wtsXPon7mNlAazTciKb0Lv	81
user_3Clo0wtsXPon7mNlAazTciKb0Lv	82
user_3Clo0wtsXPon7mNlAazTciKb0Lv	83
user_3Clo0wtsXPon7mNlAazTciKb0Lv	84
user_3Clo0wtsXPon7mNlAazTciKb0Lv	85
user_3Clo0wtsXPon7mNlAazTciKb0Lv	86
user_3Clo0wtsXPon7mNlAazTciKb0Lv	87
user_3Clo0wtsXPon7mNlAazTciKb0Lv	88
user_3Clo0wtsXPon7mNlAazTciKb0Lv	89
user_3Clo0wtsXPon7mNlAazTciKb0Lv	90
user_3Clo0wtsXPon7mNlAazTciKb0Lv	91
user_3Clo0wtsXPon7mNlAazTciKb0Lv	92
user_3Clo0wtsXPon7mNlAazTciKb0Lv	93
user_3Clo0wtsXPon7mNlAazTciKb0Lv	94
user_3Clo0wtsXPon7mNlAazTciKb0Lv	95
user_3Clo0wtsXPon7mNlAazTciKb0Lv	96
user_3Clo0wtsXPon7mNlAazTciKb0Lv	97
user_3Clo0wtsXPon7mNlAazTciKb0Lv	98
user_3Clo0wtsXPon7mNlAazTciKb0Lv	99
user_3Clo0wtsXPon7mNlAazTciKb0Lv	100
user_3Clo0wtsXPon7mNlAazTciKb0Lv	101
user_3Clo0wtsXPon7mNlAazTciKb0Lv	102
user_3Clo0wtsXPon7mNlAazTciKb0Lv	103
user_3Clo0wtsXPon7mNlAazTciKb0Lv	104
user_3Clo0wtsXPon7mNlAazTciKb0Lv	105
user_3Clo0wtsXPon7mNlAazTciKb0Lv	106
user_3Clo0wtsXPon7mNlAazTciKb0Lv	107
user_3Clo0wtsXPon7mNlAazTciKb0Lv	108
user_3Clo0wtsXPon7mNlAazTciKb0Lv	109
user_3Clo0wtsXPon7mNlAazTciKb0Lv	110
user_3Clo0wtsXPon7mNlAazTciKb0Lv	111
user_3Clo0wtsXPon7mNlAazTciKb0Lv	112
user_3Clo0wtsXPon7mNlAazTciKb0Lv	113
user_3Clo0wtsXPon7mNlAazTciKb0Lv	114
user_3Clo0wtsXPon7mNlAazTciKb0Lv	115
user_3Clo0wtsXPon7mNlAazTciKb0Lv	116
user_3Clo0wtsXPon7mNlAazTciKb0Lv	117
user_3Clo0wtsXPon7mNlAazTciKb0Lv	118
user_3Clo0wtsXPon7mNlAazTciKb0Lv	119
user_3Clo0wtsXPon7mNlAazTciKb0Lv	120
user_3Clo0wtsXPon7mNlAazTciKb0Lv	121
user_3Clo0wtsXPon7mNlAazTciKb0Lv	122
user_3Clo0wtsXPon7mNlAazTciKb0Lv	123
user_3Clo0wtsXPon7mNlAazTciKb0Lv	124
user_3Clo0wtsXPon7mNlAazTciKb0Lv	125
user_3Clo0wtsXPon7mNlAazTciKb0Lv	126
user_3Clo0wtsXPon7mNlAazTciKb0Lv	127
user_3Clo0wtsXPon7mNlAazTciKb0Lv	128
user_3Clo0wtsXPon7mNlAazTciKb0Lv	129
user_3Clo0wtsXPon7mNlAazTciKb0Lv	130
user_3Clo0wtsXPon7mNlAazTciKb0Lv	131
user_3Clo0wtsXPon7mNlAazTciKb0Lv	132
user_3Clo0wtsXPon7mNlAazTciKb0Lv	133
user_3Clo0wtsXPon7mNlAazTciKb0Lv	134
user_3Clo0wtsXPon7mNlAazTciKb0Lv	135
user_3Clo0wtsXPon7mNlAazTciKb0Lv	136
user_3Clo0wtsXPon7mNlAazTciKb0Lv	137
user_3Clo0wtsXPon7mNlAazTciKb0Lv	138
user_3Clo0wtsXPon7mNlAazTciKb0Lv	139
user_3Clo0wtsXPon7mNlAazTciKb0Lv	140
user_3Clo0wtsXPon7mNlAazTciKb0Lv	141
user_3Clo0wtsXPon7mNlAazTciKb0Lv	142
user_3Clo0wtsXPon7mNlAazTciKb0Lv	143
user_3Clo0wtsXPon7mNlAazTciKb0Lv	144
user_3Clo0wtsXPon7mNlAazTciKb0Lv	145
user_3Clo0wtsXPon7mNlAazTciKb0Lv	146
user_3Clo0wtsXPon7mNlAazTciKb0Lv	147
user_3Clo0wtsXPon7mNlAazTciKb0Lv	148
user_3Clo0wtsXPon7mNlAazTciKb0Lv	149
user_3Clo0wtsXPon7mNlAazTciKb0Lv	150
user_3Clo0wtsXPon7mNlAazTciKb0Lv	151
user_3Clo0wtsXPon7mNlAazTciKb0Lv	152
user_3Clo0wtsXPon7mNlAazTciKb0Lv	153
user_3Clo0wtsXPon7mNlAazTciKb0Lv	154
user_3Clo0wtsXPon7mNlAazTciKb0Lv	155
user_3Clo0wtsXPon7mNlAazTciKb0Lv	156
user_3Clo0wtsXPon7mNlAazTciKb0Lv	157
user_3Clo0wtsXPon7mNlAazTciKb0Lv	158
user_3Clo0wtsXPon7mNlAazTciKb0Lv	159
user_3Clo0wtsXPon7mNlAazTciKb0Lv	160
user_3Clo0wtsXPon7mNlAazTciKb0Lv	161
user_3Clo0wtsXPon7mNlAazTciKb0Lv	162
user_3Clo0wtsXPon7mNlAazTciKb0Lv	163
user_3Clo0wtsXPon7mNlAazTciKb0Lv	164
user_3Clo0wtsXPon7mNlAazTciKb0Lv	165
user_3Clo0wtsXPon7mNlAazTciKb0Lv	166
user_3Clo0wtsXPon7mNlAazTciKb0Lv	167
user_3Clo0wtsXPon7mNlAazTciKb0Lv	168
user_3Clo0wtsXPon7mNlAazTciKb0Lv	169
user_3Clo0wtsXPon7mNlAazTciKb0Lv	170
user_3Clo0wtsXPon7mNlAazTciKb0Lv	171
user_3Clo0wtsXPon7mNlAazTciKb0Lv	172
user_3Clo0wtsXPon7mNlAazTciKb0Lv	173
user_3Clo0wtsXPon7mNlAazTciKb0Lv	174
user_3Clo0wtsXPon7mNlAazTciKb0Lv	175
user_3Clo0wtsXPon7mNlAazTciKb0Lv	176
user_3Clo0wtsXPon7mNlAazTciKb0Lv	177
user_3Clo0wtsXPon7mNlAazTciKb0Lv	178
user_3Clo0wtsXPon7mNlAazTciKb0Lv	179
user_3Clo0wtsXPon7mNlAazTciKb0Lv	180
user_3Clo0wtsXPon7mNlAazTciKb0Lv	181
user_3Clo0wtsXPon7mNlAazTciKb0Lv	182
user_3Clo0wtsXPon7mNlAazTciKb0Lv	183
user_3Clo0wtsXPon7mNlAazTciKb0Lv	184
user_3Clo0wtsXPon7mNlAazTciKb0Lv	185
user_3Clo0wtsXPon7mNlAazTciKb0Lv	186
user_3Clo0wtsXPon7mNlAazTciKb0Lv	187
user_3Clo0wtsXPon7mNlAazTciKb0Lv	188
user_3Clo0wtsXPon7mNlAazTciKb0Lv	189
user_3Clo0wtsXPon7mNlAazTciKb0Lv	190
user_3Clo0wtsXPon7mNlAazTciKb0Lv	191
user_3Clo0wtsXPon7mNlAazTciKb0Lv	192
user_3Clo0wtsXPon7mNlAazTciKb0Lv	193
user_3Clo0wtsXPon7mNlAazTciKb0Lv	194
user_3Clo0wtsXPon7mNlAazTciKb0Lv	195
user_3Clo0wtsXPon7mNlAazTciKb0Lv	196
user_3Clo0wtsXPon7mNlAazTciKb0Lv	197
user_3Clo0wtsXPon7mNlAazTciKb0Lv	198
user_3Clo0wtsXPon7mNlAazTciKb0Lv	199
user_3Clo0wtsXPon7mNlAazTciKb0Lv	200
user_3Clo0wtsXPon7mNlAazTciKb0Lv	201
user_3Clo0wtsXPon7mNlAazTciKb0Lv	202
user_3Clo0wtsXPon7mNlAazTciKb0Lv	203
user_3Clo0wtsXPon7mNlAazTciKb0Lv	204
user_3Clo0wtsXPon7mNlAazTciKb0Lv	205
user_3Clo0wtsXPon7mNlAazTciKb0Lv	206
user_3Clo0wtsXPon7mNlAazTciKb0Lv	207
user_3Clo0wtsXPon7mNlAazTciKb0Lv	208
user_3Clo0wtsXPon7mNlAazTciKb0Lv	209
user_3Clo0wtsXPon7mNlAazTciKb0Lv	210
user_3Clo0wtsXPon7mNlAazTciKb0Lv	211
user_3Clo0wtsXPon7mNlAazTciKb0Lv	212
user_3Clo0wtsXPon7mNlAazTciKb0Lv	213
user_3Clo0wtsXPon7mNlAazTciKb0Lv	214
user_3Clo0wtsXPon7mNlAazTciKb0Lv	215
user_3Clo0wtsXPon7mNlAazTciKb0Lv	216
user_3Clo0wtsXPon7mNlAazTciKb0Lv	217
user_3Clo0wtsXPon7mNlAazTciKb0Lv	218
user_3Clo0wtsXPon7mNlAazTciKb0Lv	219
user_3Clo0wtsXPon7mNlAazTciKb0Lv	220
user_3Clo0wtsXPon7mNlAazTciKb0Lv	221
user_3Clo0wtsXPon7mNlAazTciKb0Lv	222
user_3Clo0wtsXPon7mNlAazTciKb0Lv	223
user_3Clo0wtsXPon7mNlAazTciKb0Lv	224
user_3Clo0wtsXPon7mNlAazTciKb0Lv	225
user_3Clo0wtsXPon7mNlAazTciKb0Lv	226
user_3Clo0wtsXPon7mNlAazTciKb0Lv	227
user_3Clo0wtsXPon7mNlAazTciKb0Lv	228
user_3Clo0wtsXPon7mNlAazTciKb0Lv	229
user_3Clo0wtsXPon7mNlAazTciKb0Lv	230
user_3CkzswbYbPXoT2B5OufMVDWwCOK	1
user_3CkzswbYbPXoT2B5OufMVDWwCOK	2
user_3CkzswbYbPXoT2B5OufMVDWwCOK	3
user_3CkzswbYbPXoT2B5OufMVDWwCOK	4
user_3CkzswbYbPXoT2B5OufMVDWwCOK	5
user_3CkzswbYbPXoT2B5OufMVDWwCOK	6
user_3CkzswbYbPXoT2B5OufMVDWwCOK	7
user_3CkzswbYbPXoT2B5OufMVDWwCOK	8
user_3CkzswbYbPXoT2B5OufMVDWwCOK	9
user_3CkzswbYbPXoT2B5OufMVDWwCOK	10
user_3CkzswbYbPXoT2B5OufMVDWwCOK	11
user_3CkzswbYbPXoT2B5OufMVDWwCOK	12
user_3CkzswbYbPXoT2B5OufMVDWwCOK	13
user_3CkzswbYbPXoT2B5OufMVDWwCOK	14
user_3CkzswbYbPXoT2B5OufMVDWwCOK	15
user_3CkzswbYbPXoT2B5OufMVDWwCOK	16
user_3CkzswbYbPXoT2B5OufMVDWwCOK	17
user_3CkzswbYbPXoT2B5OufMVDWwCOK	18
user_3CkzswbYbPXoT2B5OufMVDWwCOK	19
user_3CkzswbYbPXoT2B5OufMVDWwCOK	20
user_3CkzswbYbPXoT2B5OufMVDWwCOK	21
user_3CkzswbYbPXoT2B5OufMVDWwCOK	22
user_3CkzswbYbPXoT2B5OufMVDWwCOK	23
user_3CkzswbYbPXoT2B5OufMVDWwCOK	24
user_3CkzswbYbPXoT2B5OufMVDWwCOK	25
user_3CkzswbYbPXoT2B5OufMVDWwCOK	26
user_3CkzswbYbPXoT2B5OufMVDWwCOK	27
user_3CkzswbYbPXoT2B5OufMVDWwCOK	28
user_3CkzswbYbPXoT2B5OufMVDWwCOK	29
user_3CkzswbYbPXoT2B5OufMVDWwCOK	30
user_3CkzswbYbPXoT2B5OufMVDWwCOK	31
user_3CkzswbYbPXoT2B5OufMVDWwCOK	32
user_3CkzswbYbPXoT2B5OufMVDWwCOK	33
user_3CkzswbYbPXoT2B5OufMVDWwCOK	34
user_3CkzswbYbPXoT2B5OufMVDWwCOK	35
user_3CkzswbYbPXoT2B5OufMVDWwCOK	36
user_3CkzswbYbPXoT2B5OufMVDWwCOK	37
user_3CkzswbYbPXoT2B5OufMVDWwCOK	38
user_3CkzswbYbPXoT2B5OufMVDWwCOK	39
user_3CkzswbYbPXoT2B5OufMVDWwCOK	40
user_3CkzswbYbPXoT2B5OufMVDWwCOK	41
user_3CkzswbYbPXoT2B5OufMVDWwCOK	42
user_3CkzswbYbPXoT2B5OufMVDWwCOK	43
user_3CkzswbYbPXoT2B5OufMVDWwCOK	44
user_3CkzswbYbPXoT2B5OufMVDWwCOK	45
user_3CkzswbYbPXoT2B5OufMVDWwCOK	46
user_3CkzswbYbPXoT2B5OufMVDWwCOK	47
user_3CkzswbYbPXoT2B5OufMVDWwCOK	48
user_3CkzswbYbPXoT2B5OufMVDWwCOK	49
user_3CkzswbYbPXoT2B5OufMVDWwCOK	50
user_3CkzswbYbPXoT2B5OufMVDWwCOK	51
user_3CkzswbYbPXoT2B5OufMVDWwCOK	52
user_3CkzswbYbPXoT2B5OufMVDWwCOK	53
user_3CkzswbYbPXoT2B5OufMVDWwCOK	54
user_3CkzswbYbPXoT2B5OufMVDWwCOK	55
user_3CkzswbYbPXoT2B5OufMVDWwCOK	56
user_3CkzswbYbPXoT2B5OufMVDWwCOK	57
user_3CkzswbYbPXoT2B5OufMVDWwCOK	58
user_3CkzswbYbPXoT2B5OufMVDWwCOK	59
user_3CkzswbYbPXoT2B5OufMVDWwCOK	60
user_3CkzswbYbPXoT2B5OufMVDWwCOK	61
user_3CkzswbYbPXoT2B5OufMVDWwCOK	62
user_3CkzswbYbPXoT2B5OufMVDWwCOK	63
user_3CkzswbYbPXoT2B5OufMVDWwCOK	64
user_3CkzswbYbPXoT2B5OufMVDWwCOK	65
user_3CkzswbYbPXoT2B5OufMVDWwCOK	66
user_3CkzswbYbPXoT2B5OufMVDWwCOK	67
user_3CkzswbYbPXoT2B5OufMVDWwCOK	68
user_3CkzswbYbPXoT2B5OufMVDWwCOK	69
user_3CkzswbYbPXoT2B5OufMVDWwCOK	70
user_3CkzswbYbPXoT2B5OufMVDWwCOK	71
user_3CkzswbYbPXoT2B5OufMVDWwCOK	72
user_3CkzswbYbPXoT2B5OufMVDWwCOK	73
user_3CkzswbYbPXoT2B5OufMVDWwCOK	74
user_3CkzswbYbPXoT2B5OufMVDWwCOK	75
user_3CkzswbYbPXoT2B5OufMVDWwCOK	76
user_3CkzswbYbPXoT2B5OufMVDWwCOK	77
user_3CkzswbYbPXoT2B5OufMVDWwCOK	78
user_3CkzswbYbPXoT2B5OufMVDWwCOK	79
user_3CkzswbYbPXoT2B5OufMVDWwCOK	80
user_3CkzswbYbPXoT2B5OufMVDWwCOK	81
user_3CkzswbYbPXoT2B5OufMVDWwCOK	82
user_3CkzswbYbPXoT2B5OufMVDWwCOK	83
user_3CkzswbYbPXoT2B5OufMVDWwCOK	84
user_3CkzswbYbPXoT2B5OufMVDWwCOK	85
user_3CkzswbYbPXoT2B5OufMVDWwCOK	86
user_3CkzswbYbPXoT2B5OufMVDWwCOK	87
user_3CkzswbYbPXoT2B5OufMVDWwCOK	88
user_3CkzswbYbPXoT2B5OufMVDWwCOK	89
user_3CkzswbYbPXoT2B5OufMVDWwCOK	90
user_3CkzswbYbPXoT2B5OufMVDWwCOK	91
user_3CkzswbYbPXoT2B5OufMVDWwCOK	92
user_3CkzswbYbPXoT2B5OufMVDWwCOK	93
user_3CkzswbYbPXoT2B5OufMVDWwCOK	94
user_3CkzswbYbPXoT2B5OufMVDWwCOK	95
user_3CkzswbYbPXoT2B5OufMVDWwCOK	96
user_3CkzswbYbPXoT2B5OufMVDWwCOK	97
user_3CkzswbYbPXoT2B5OufMVDWwCOK	98
user_3CkzswbYbPXoT2B5OufMVDWwCOK	99
user_3CkzswbYbPXoT2B5OufMVDWwCOK	100
user_3CkzswbYbPXoT2B5OufMVDWwCOK	101
user_3CkzswbYbPXoT2B5OufMVDWwCOK	102
user_3CkzswbYbPXoT2B5OufMVDWwCOK	103
user_3CkzswbYbPXoT2B5OufMVDWwCOK	104
user_3CkzswbYbPXoT2B5OufMVDWwCOK	105
user_3CkzswbYbPXoT2B5OufMVDWwCOK	106
user_3CkzswbYbPXoT2B5OufMVDWwCOK	107
user_3CkzswbYbPXoT2B5OufMVDWwCOK	108
user_3CkzswbYbPXoT2B5OufMVDWwCOK	109
user_3CkzswbYbPXoT2B5OufMVDWwCOK	110
user_3CkzswbYbPXoT2B5OufMVDWwCOK	111
user_3CkzswbYbPXoT2B5OufMVDWwCOK	112
user_3CkzswbYbPXoT2B5OufMVDWwCOK	113
user_3CkzswbYbPXoT2B5OufMVDWwCOK	114
user_3CkzswbYbPXoT2B5OufMVDWwCOK	115
user_3CkzswbYbPXoT2B5OufMVDWwCOK	116
user_3CkzswbYbPXoT2B5OufMVDWwCOK	117
user_3CkzswbYbPXoT2B5OufMVDWwCOK	118
user_3CkzswbYbPXoT2B5OufMVDWwCOK	119
user_3CkzswbYbPXoT2B5OufMVDWwCOK	120
user_3CkzswbYbPXoT2B5OufMVDWwCOK	121
user_3CkzswbYbPXoT2B5OufMVDWwCOK	122
user_3CkzswbYbPXoT2B5OufMVDWwCOK	123
user_3CkzswbYbPXoT2B5OufMVDWwCOK	124
user_3CkzswbYbPXoT2B5OufMVDWwCOK	125
user_3CkzswbYbPXoT2B5OufMVDWwCOK	126
user_3CkzswbYbPXoT2B5OufMVDWwCOK	127
user_3CkzswbYbPXoT2B5OufMVDWwCOK	128
user_3CkzswbYbPXoT2B5OufMVDWwCOK	129
user_3CkzswbYbPXoT2B5OufMVDWwCOK	130
user_3CkzswbYbPXoT2B5OufMVDWwCOK	131
user_3CkzswbYbPXoT2B5OufMVDWwCOK	132
user_3CkzswbYbPXoT2B5OufMVDWwCOK	133
user_3CkzswbYbPXoT2B5OufMVDWwCOK	134
user_3CkzswbYbPXoT2B5OufMVDWwCOK	135
user_3CkzswbYbPXoT2B5OufMVDWwCOK	136
user_3CkzswbYbPXoT2B5OufMVDWwCOK	137
user_3CkzswbYbPXoT2B5OufMVDWwCOK	138
user_3CkzswbYbPXoT2B5OufMVDWwCOK	139
user_3CkzswbYbPXoT2B5OufMVDWwCOK	140
user_3CkzswbYbPXoT2B5OufMVDWwCOK	141
user_3CkzswbYbPXoT2B5OufMVDWwCOK	142
user_3CkzswbYbPXoT2B5OufMVDWwCOK	143
user_3CkzswbYbPXoT2B5OufMVDWwCOK	144
user_3CkzswbYbPXoT2B5OufMVDWwCOK	145
user_3CkzswbYbPXoT2B5OufMVDWwCOK	146
user_3CkzswbYbPXoT2B5OufMVDWwCOK	147
user_3CkzswbYbPXoT2B5OufMVDWwCOK	148
user_3CkzswbYbPXoT2B5OufMVDWwCOK	149
user_3CkzswbYbPXoT2B5OufMVDWwCOK	150
user_3CkzswbYbPXoT2B5OufMVDWwCOK	151
user_3CkzswbYbPXoT2B5OufMVDWwCOK	152
user_3CkzswbYbPXoT2B5OufMVDWwCOK	153
user_3CkzswbYbPXoT2B5OufMVDWwCOK	154
user_3CkzswbYbPXoT2B5OufMVDWwCOK	155
user_3CkzswbYbPXoT2B5OufMVDWwCOK	156
user_3CkzswbYbPXoT2B5OufMVDWwCOK	157
user_3CkzswbYbPXoT2B5OufMVDWwCOK	158
user_3CkzswbYbPXoT2B5OufMVDWwCOK	159
user_3CkzswbYbPXoT2B5OufMVDWwCOK	160
user_3CkzswbYbPXoT2B5OufMVDWwCOK	161
user_3CkzswbYbPXoT2B5OufMVDWwCOK	162
user_3CkzswbYbPXoT2B5OufMVDWwCOK	163
user_3CkzswbYbPXoT2B5OufMVDWwCOK	164
user_3CkzswbYbPXoT2B5OufMVDWwCOK	165
user_3CkzswbYbPXoT2B5OufMVDWwCOK	166
user_3CkzswbYbPXoT2B5OufMVDWwCOK	167
user_3CkzswbYbPXoT2B5OufMVDWwCOK	168
user_3CkzswbYbPXoT2B5OufMVDWwCOK	169
user_3CkzswbYbPXoT2B5OufMVDWwCOK	170
user_3CkzswbYbPXoT2B5OufMVDWwCOK	171
user_3CkzswbYbPXoT2B5OufMVDWwCOK	172
user_3CkzswbYbPXoT2B5OufMVDWwCOK	173
user_3CkzswbYbPXoT2B5OufMVDWwCOK	174
user_3CkzswbYbPXoT2B5OufMVDWwCOK	175
user_3CkzswbYbPXoT2B5OufMVDWwCOK	176
user_3CkzswbYbPXoT2B5OufMVDWwCOK	177
user_3CkzswbYbPXoT2B5OufMVDWwCOK	178
user_3CkzswbYbPXoT2B5OufMVDWwCOK	179
user_3CkzswbYbPXoT2B5OufMVDWwCOK	180
user_3CkzswbYbPXoT2B5OufMVDWwCOK	181
user_3CkzswbYbPXoT2B5OufMVDWwCOK	182
user_3CkzswbYbPXoT2B5OufMVDWwCOK	183
user_3CkzswbYbPXoT2B5OufMVDWwCOK	184
user_3CkzswbYbPXoT2B5OufMVDWwCOK	185
user_3CkzswbYbPXoT2B5OufMVDWwCOK	186
user_3CkzswbYbPXoT2B5OufMVDWwCOK	187
user_3CkzswbYbPXoT2B5OufMVDWwCOK	188
user_3CkzswbYbPXoT2B5OufMVDWwCOK	189
user_3CkzswbYbPXoT2B5OufMVDWwCOK	190
user_3CkzswbYbPXoT2B5OufMVDWwCOK	191
user_3CkzswbYbPXoT2B5OufMVDWwCOK	192
user_3CkzswbYbPXoT2B5OufMVDWwCOK	193
user_3CkzswbYbPXoT2B5OufMVDWwCOK	194
user_3CkzswbYbPXoT2B5OufMVDWwCOK	195
user_3CkzswbYbPXoT2B5OufMVDWwCOK	196
user_3CkzswbYbPXoT2B5OufMVDWwCOK	197
user_3CkzswbYbPXoT2B5OufMVDWwCOK	198
user_3CkzswbYbPXoT2B5OufMVDWwCOK	199
user_3CkzswbYbPXoT2B5OufMVDWwCOK	200
user_3CkzswbYbPXoT2B5OufMVDWwCOK	201
user_3CkzswbYbPXoT2B5OufMVDWwCOK	202
user_3CkzswbYbPXoT2B5OufMVDWwCOK	203
user_3CkzswbYbPXoT2B5OufMVDWwCOK	204
user_3CkzswbYbPXoT2B5OufMVDWwCOK	205
user_3CkzswbYbPXoT2B5OufMVDWwCOK	206
user_3CkzswbYbPXoT2B5OufMVDWwCOK	207
user_3CkzswbYbPXoT2B5OufMVDWwCOK	208
user_3CkzswbYbPXoT2B5OufMVDWwCOK	209
user_3CkzswbYbPXoT2B5OufMVDWwCOK	210
user_3CkzswbYbPXoT2B5OufMVDWwCOK	211
user_3CkzswbYbPXoT2B5OufMVDWwCOK	212
user_3CkzswbYbPXoT2B5OufMVDWwCOK	213
user_3CkzswbYbPXoT2B5OufMVDWwCOK	214
user_3CkzswbYbPXoT2B5OufMVDWwCOK	215
user_3CkzswbYbPXoT2B5OufMVDWwCOK	216
user_3CkzswbYbPXoT2B5OufMVDWwCOK	217
user_3CkzswbYbPXoT2B5OufMVDWwCOK	218
user_3CkzswbYbPXoT2B5OufMVDWwCOK	219
user_3CkzswbYbPXoT2B5OufMVDWwCOK	220
user_3CkzswbYbPXoT2B5OufMVDWwCOK	221
user_3CkzswbYbPXoT2B5OufMVDWwCOK	222
user_3CkzswbYbPXoT2B5OufMVDWwCOK	223
user_3CkzswbYbPXoT2B5OufMVDWwCOK	224
user_3CkzswbYbPXoT2B5OufMVDWwCOK	225
user_3CkzswbYbPXoT2B5OufMVDWwCOK	226
user_3CkzswbYbPXoT2B5OufMVDWwCOK	227
user_3CkzswbYbPXoT2B5OufMVDWwCOK	228
user_3CkzswbYbPXoT2B5OufMVDWwCOK	229
user_3CkzswbYbPXoT2B5OufMVDWwCOK	230
user_38bzMM6AVsxkk7dJNc7n4GLSkDm	196
user_38bzMM6AVsxkk7dJNc7n4GLSkDm	151
user_38bzMM6AVsxkk7dJNc7n4GLSkDm	189
user_38bzMM6AVsxkk7dJNc7n4GLSkDm	118
user_38bzMM6AVsxkk7dJNc7n4GLSkDm	119
user_38bzMM6AVsxkk7dJNc7n4GLSkDm	150
user_38bzMM6AVsxkk7dJNc7n4GLSkDm	192
user_38bzMM6AVsxkk7dJNc7n4GLSkDm	184
user_38bzMM6AVsxkk7dJNc7n4GLSkDm	177
user_38bzMM6AVsxkk7dJNc7n4GLSkDm	191
user_38bzMM6AVsxkk7dJNc7n4GLSkDm	154
user_38bzMM6AVsxkk7dJNc7n4GLSkDm	217
user_38bzMM6AVsxkk7dJNc7n4GLSkDm	187
user_38bzMM6AVsxkk7dJNc7n4GLSkDm	155
user_38bzMM6AVsxkk7dJNc7n4GLSkDm	153
user_38bzMM6AVsxkk7dJNc7n4GLSkDm	146
user_38bzMM6AVsxkk7dJNc7n4GLSkDm	145
user_38bzMM6AVsxkk7dJNc7n4GLSkDm	207
user_38bzMM6AVsxkk7dJNc7n4GLSkDm	185
user_38bzMM6AVsxkk7dJNc7n4GLSkDm	121
user_38bzMM6AVsxkk7dJNc7n4GLSkDm	208
user_38bzMM6AVsxkk7dJNc7n4GLSkDm	183
user_38bzMM6AVsxkk7dJNc7n4GLSkDm	141
user_38bzMM6AVsxkk7dJNc7n4GLSkDm	200
user_38bzMM6AVsxkk7dJNc7n4GLSkDm	142
user_38bzMM6AVsxkk7dJNc7n4GLSkDm	1
user_3CPCdO9xP7lG2xuj7xsd466sLdd	196
user_3CPCdO9xP7lG2xuj7xsd466sLdd	151
user_3CPCdO9xP7lG2xuj7xsd466sLdd	189
user_3CPCdO9xP7lG2xuj7xsd466sLdd	118
user_3CPCdO9xP7lG2xuj7xsd466sLdd	119
user_3CPCdO9xP7lG2xuj7xsd466sLdd	150
user_3CPCdO9xP7lG2xuj7xsd466sLdd	192
user_3CPCdO9xP7lG2xuj7xsd466sLdd	184
user_3CPCdO9xP7lG2xuj7xsd466sLdd	177
user_3CPCdO9xP7lG2xuj7xsd466sLdd	191
user_3CPCdO9xP7lG2xuj7xsd466sLdd	154
user_3CPCdO9xP7lG2xuj7xsd466sLdd	217
user_3CPCdO9xP7lG2xuj7xsd466sLdd	187
user_3CPCdO9xP7lG2xuj7xsd466sLdd	155
user_3CPCdO9xP7lG2xuj7xsd466sLdd	153
user_3CPCdO9xP7lG2xuj7xsd466sLdd	146
user_3CPCdO9xP7lG2xuj7xsd466sLdd	145
user_3CPCdO9xP7lG2xuj7xsd466sLdd	207
user_3CPCdO9xP7lG2xuj7xsd466sLdd	185
user_3CPCdO9xP7lG2xuj7xsd466sLdd	121
user_3CPCdO9xP7lG2xuj7xsd466sLdd	208
user_3CPCdO9xP7lG2xuj7xsd466sLdd	183
user_3CPCdO9xP7lG2xuj7xsd466sLdd	141
user_3CPCdO9xP7lG2xuj7xsd466sLdd	200
user_3CPCdO9xP7lG2xuj7xsd466sLdd	142
user_3CPCdO9xP7lG2xuj7xsd466sLdd	1
\.


--
-- Data for Name: ingredient_recipe_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ingredient_recipe_data (ingredient_id, recipe_data_id, unit_id, quantity) FROM stdin;
105	1	1	200
118	1	1	250
107	1	10	2
183	1	1	10
109	1	1	200
220	1	10	2
180	1	8	2
118	2	1	500
9	2	1	250
192	2	10	3
181	2	1	100
119	2	1	70
118	3	1	300
180	3	8	6
119	3	1	100
104	3	6	2
105	3	1	100
4	4	8	3
11	4	8	1
51	4	8	1
113	4	1	100
145	4	10	2
170	4	1	100
183	4	10	1
184	4	9	1
190	4	14	1
213	4	14	1
4	5	8	2
5	5	6	2
157	5	10	2
180	5	8	4
183	5	9	1
184	5	9	1
2	5	8	1
3	5	15	2
190	5	14	1
16	6	14	1
113	6	1	200
26	6	8	1
180	6	8	3
183	6	9	1
184	6	9	1
3	6	15	4
145	6	5	5
118	7	1	500
183	7	10	1
146	7	10	1
180	7	8	1
1	7	6	1
91	8	17	1
190	8	18	1
107	8	10	4
155	8	10	1
44	8	6	0.5
183	8	9	1
184	8	9	0.5
51	8	6	0.5
114	9	1	250
158	9	2	1
91	9	17	1
183	9	9	1
184	9	9	0.5
188	9	9	1
44	9	8	0.5
157	10	1	100
76	10	1	250
77	10	1	250
25	10	8	2
7	10	8	2
176	10	6	4
173	10	2	1
196	10	8	2
2	10	8	1
188	10	9	2
208	10	9	1
189	10	9	1
191	10	9	1
3	10	15	3
145	10	10	1
183	10	9	1
184	10	9	0.5
4	11	8	3
111	11	8	1
151	11	10	1
169	11	10	1
183	11	11	1
184	11	11	0.5
188	11	9	1
189	11	18	0.5
\.


--
-- Data for Name: ingredients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ingredients (id, name) FROM stdin;
1	Víz
2	Vöröshagyma
3	Fokhagyma
4	Paradicsom
5	Paprika
6	Chili
7	Sárgarépa
8	Fehérrépa
9	Burgonya
10	Édesburgonya
11	Uborka
12	Cukkini
13	Padlizsán
14	Brokkoli
15	Karfiol
16	Spenót
17	Káposzta
18	Lilakáposzta
19	Fejes saláta
20	Gomba
21	Zöldborsó
22	Zöldbab
23	Kukorica
24	Zeller
25	Szárzeller
26	Póréhagyma
27	Újhagyma
28	Édeskömény
29	Kelkáposzta
30	Spárga
31	Sütőtök
32	Retek
33	Cékla
34	Rukkola
35	Pak choi
36	Mogyoróhagyma
37	Articsóka
38	Cukorborsó
39	Edámbab
40	Bébikukorica
41	Gesztenye
42	Babcsíra
43	Tomatillo
44	Lilahagyma
45	Alma
46	Körte
47	Banán
48	Eper
49	Áfonya
50	Málna
51	Citrom
52	Narancs
53	Őszibarack
54	Sárgabarack
55	Szilva
56	Lime
57	Mangó
58	Ananász
59	Kókusz
60	Avokádó
61	Datolya
62	Füge
63	Mazsola
64	Aszalt szilva
65	Aszalt áfonya
66	Csirkemell
67	Csirkecomb
68	Csirke felsőcomb
69	Csirke alsócomb
70	Egész csirke
71	Sertéshús
72	Sertéskaraj
73	Császárhús
74	Sertéslapocka
75	Marhahús
76	Darált marhahús
77	Darált sertéshús
78	Marhanyak
79	Pulyka
80	Bacon
81	Kolbász
82	Sonka
83	Bárányhús
84	Borjúhús
85	Pancetta
86	Prosciutto
87	Zsír
88	Császárszalonna
89	Zsírszalonna
90	Lazac
91	Tonhal
92	Tőkehal
93	Garnélarák
94	Makréla
95	Szardínia
96	Szardella
97	Rák
98	Homár
99	Polip
100	Pisztráng
101	Királyrák
102	Feketekagyló
103	Osztriga
104	Tej
105	Vaj
106	Tejszín
107	Tejföl
108	Joghurt
109	Sajt
110	Túró
111	Mozzarella
112	Parmezán
113	Feta sajt
114	Krémsajt
115	Pecorino
116	Ricotta
117	Sűrített tej
118	Búzaliszt
119	Cukor
120	Barna cukor
121	Porcukor
122	Rizs
123	Tészta
124	Spagetti
125	Kenyér
126	Zsemlemorzsa
127	Zabpehely
128	Arborio rizs
129	Csicseriborsó
130	Lencse
131	Fekete bab
132	Vesebab
133	Fehér vesebab
134	Tarkabab
135	Hajdina
136	Kuszkusz
137	Bulgur
138	Rizstészta
139	Kukoricadara
140	Száraz élesztő
141	Sütőpor
142	Szódabikarbóna
143	Kukoricakeményítő
144	Tofu
145	Olívaolaj
146	Napraforgóolaj
147	Növényi olaj
148	Kókuszolaj
149	Szezámolaj
150	Ecet
151	Balzsamecet
152	Szójaszósz
153	Mustár
154	Ketchup
155	Majonéz
156	Méz
157	Paradicsompüré
158	Paradicsomszósz
159	Kókusztej
160	Worcestershire szósz
161	Halszósz
162	Osztrigaszósz
163	Hoisin szósz
164	Vörös curry paszta
165	Miso paszta
166	Tahini
167	Mogyoróvaj
168	Juharszirup
169	Kapribogyó
170	Olajbogyó
171	Torma
172	Fehérbor
173	Vörösbor
174	Csirkealaplé
175	Marhaalaplé
176	Zöldségalaplé
177	Kakaópor
178	Étcsokoládé
179	Matcha por
180	Tojás
181	Panírmorzsa
182	Panko morzsa
183	Só
184	Fekete bors
185	Őrölt paprika
186	Füstölt paprika
187	Kömény
188	Oregánó
189	Bazsalikom
190	Petrezselyem
191	Kakukkfű
192	Fahéj
193	Vanília kivonat
194	Gyömbér
195	Kurkuma
196	Babérlevél
197	Chilipehely
198	Chilipor
199	Szerecsendió
200	Szegfűszeg
201	Szegfűbors
202	Kardamom
203	Csillagánizs
204	Sáfrány
205	Garam masala
206	Curry por
207	Őrölt koriander
208	Rozmaring
209	Zsálya
210	Kapor
211	Metélőhagyma
212	Koriander
213	Menta
214	Majoránna
215	Tárkony
216	Sumák
217	Kínai ötfűszer
218	Mák
219	Szezámmag
220	Köménymag
221	Mustármag
222	Dió
223	Mandula
224	Mogyoró
225	Napraforgómag
226	Tökmag
227	Földimogyoró
228	Kesudió
229	Fenyőmag
230	Lenmag
\.


--
-- Data for Name: recipe_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recipe_data (id, recipe_id, title, description, instructions, preview_image_url, cook_time_minutes, prep_time_minutes, servings, verified, created_at, updated_at) FROM stdin;
1	1	Sajtos-köményes ropi	Sós aprósütemény bármilyen alkalomra, akár nagy adagban elkészítve, majd fagyasztóban tárolva váratlan vendégek esetén.	A sajtot lereszeljük és kettéosztjuk.\nA sajt egyik részén egy tojáson és a köménymagon kívül mindent összegyúrunk, majd ha egységes tésztát kaptunk legalább 30 percet fagyasztóban pihentetjük.\n3-4mm vastagra nyújtjuk a tésztát, majd a maradék egy tojást felverjük és lekenjük vele a tésztát.\nEzután megszórjuk sajttal és köménymaggal, majd ízlés szerinti vastagságú rudakat vágunk belőle.\n\n200C°-os előmelegített sütőben 10-15 perc alatt aranybarnára sütjük.	https://uploads.znagy.hu/sajtos_komenyes_ropi.jpg	20	30	1	t	2026-04-27 15:30:13.326885	2026-04-27 15:30:13.326885
2	2	Alap nudli és gombóctészta	Családi recept, több generáció dolgozta tökéletesre.	A krumplit puhára főzzük, majd meghámozzuk (ha főzés előtt még nem tettük) ezután összetörjük. Hozzáadjuk a lisztet, ha még ragacsosnak érezzük a tésztát tegyünk annyi lisztet bele amennyit felvesz.\nA morzsához megpirítjuk a morzsát a cukorral folyamatos kevergetés mellett, csak a végén adjuk hozzá a fahéjat.\nA nudlihoz kis rudakat vágunk a tésztából, lobogó vízben főzzük amíg a felszínre nem jönnek. Ezután megforgathatjuk a morzsában.\n\nA gombócokhoz köralakúra szaggatjuk a tésztát, tölthetjük szilvával, sárgabarackkal, akár lekvárral. Gombócozás után ezt is lobogó vízben kell főzni amíg a felszínre nem úsznak, utána ezt is forgassuk meg a morzsában és kész is.	https://images.pexels.com/photos/34938281/pexels-photo-34938281.jpeg	5	30	2	t	2026-04-27 15:30:13.335479	2026-04-27 15:30:13.335479
3	3	Császármorzsa	Egyszerű és gyors császármorzsa.	A vajat megolvasztjuk, tojást a cukorral kikeverjük, majd hozzáadjuk a vajat citromhéjat és a tejet. Ha ezeket összekevertük 2-3 részletben keverjük hozzá a lisztet. Zománcolt tepsiben, előmelegített sütőben sütjük 180 C°-on amíg kérgesedik az alja. Ezután kivesszük, kisebb darabokra törjük a tésztát és készre sütjük.	https://images.pexels.com/photos/19772138/pexels-photo-19772138.jpeg	45	15	3	t	2026-04-27 15:30:13.340917	2026-04-27 15:30:13.340917
4	4	Görög saláta	Könnyed saláta, ha elegünk lenne a húsokból.	A zöldségeket ízlés szerinti méretre vágjuk, majd egy nagy tálba tesszük.\nRámorzsoljuk a feta sajtot és állni hagyjuk míg előkészítjük a friss fűszereket.\nA petrezselymet és a mentát apróra vágjuk, kifacsarjuk a fél citrom levét.\nHozzáadjuk a salátához a mentát, petrezselymet és a citrom levét, illetve a sót, borsot, olajat.\nAlaposan összekeverjük és tálalhatjuk is.	https://images.pexels.com/photos/14016727/pexels-photo-14016727.jpeg	0	15	2	t	2026-04-27 15:30:13.345921	2026-04-27 15:30:13.345921
5	5	Shakshuka	Török lecsó reggelire.	Első lépésként a paradicsomokat felkockázzuk, majd serpenyőben, alacsony lángon pirítani kezdjük.\nKözben felaprítjuk a hagymát és a többi zöldséget is. A fokhagymát össze is zúzhatjuk, viszont így megbontjuk azokat a rostokat amelyeket, ha késsel vágnánk fel, nem bántanánk. (Zúzás hatására kellemetlenebb lehet a leheltünk.)\nHa már engedett egy kevés levet a paradicsom hozzáadjuk a vöröshagymát, majd üvegesre pároljuk. Ezután mehet bele a fokhagyma, végül a paprika.\nHa az összes zöldség összeesett, fűszerezzük, és keverjük hozzá a paradicsompürét is. Hagyjuk rotyogni (továbbra is alacsony lángon) néhány percig vagy amíg szimpatikus állagú nem lesz.\nHa elértük a kívánt állagot, fakanállal csináljunk helyet a tojásoknak majd üssük bele őket és fedjük le egy fedővel. Folyósabb tojásért amint látjuk hogy a tojás a tetején már fehér, zárjuk el a gázt, pirítsunk hozzá kenyeret, szórjuk meg petrezselyemmel és kaporral, esetleg egy kevés chili olajjal. Máris fogyaszthatjuk, egészségünkre!	https://images.pexels.com/photos/9027325/pexels-photo-9027325.jpeg	10	10	2	t	2026-04-27 15:30:13.35244	2026-04-27 15:30:13.35244
6	6	Görög spenótos pite	Autentikus görög recept a mindennapokra.	Először kevés olajon megpirítjuk az összezúzott fokhagymákat, majd ráöntjük a spenótot sózzuk, borsozzuk és hagyjuk, hogy megfonnyadjon, majd a karikázott póréhagymát is hozzátesszük.\nKözben előkészítünk egy piteformát amibe egyenként beletesszük a réteslapok felét, laponként olajjal vagy vízzel (attól függően hogy diétázunk-e éppen :D) megkenjük.\nHa a lapok fele elfogyott, beletesszük a fokhagymás spenótos-hagymás keveréket, felverjük a tojásokat és azt is ráöntjük.\nVégül ahogy korábban is rátesszük a maradék réteslapot, laponként megkenjük, a tetejét is, majd 180 C°-os sütőben kb. 45 perc alatt készre sütjük	https://images.pexels.com/photos/30674035/pexels-photo-30674035.jpeg	45	20	3	t	2026-04-27 15:30:13.356865	2026-04-27 15:30:13.356865
7	7	Nokedli	Egy jól bevált nokedli alaprecept, elengedhetetlen egy magyar ember életében!	Egy nagy fazékba felteszünk nagyon sós vizet forrni!\n\nA nokedlihez mindent egy tálba teszünk és összekeverjük.\nÉrdemes fakanállal keverni, vagy legalábbis nem kézi géppel, mert így könnyen túl tudjuk keverni a tésztát.\nA tésztát pihentetni sem érdemes, ezért jobb már mielőtt belekezdünk a tésztába feltenni forrni a vizet.\nAmint forr a víz, keverünk rajta egyet, hogy majd ne tapadjon le a fazék aljára a tészta, és máris szaggathatjuk bele a nokedlit. Néhány perc alatt feljön a víz tetejére, ekkor főtt meg.\n\nNagymamámnál ilyenkor a nokedliből az első étel sajtos nokedli volt, amihez szalonnát is sütött, ennek kisült zsírjába forgatta bele a nokedlit hogy ne ragadjon össze, majd sajttal, tejföllel, korábban sült szalonnával tálalta. Persze ha éppen nem szeretnénk ezzel bajlódni vajjal, vagy bármilyen zsiradékkal működik ez a trükk, az összeragadás ellen.	https://images.pexels.com/photos/116721/pexels-photo-116721.jpeg	5	15	4	t	2026-04-27 15:30:13.362669	2026-04-27 15:30:13.362669
8	8	Tonhalkrém (Panna-féle)	Tonhalkrém tésztához, salátához akár pirítósra.	A hagymát apró kockákra vágjuk.\nEgy tálba beletesszük a tejfölt, majonézt, fél citrom levét és a tonhalkonzervet (előtte öntsük le a levét, hogy ne áztassa el a krémet).\nHozzáadjuk a hagymát és felaprítjuk a petrezselymet is, végül ezt is a krémhez keverjük.\nSózzuk, borsozzuk és kész is. Ha áll egy kicsit jobban összeérnek az ízek, de azonnal is fogyaszthatjuk.\n\nPetrezselyem helyett használhatunk koriandert is különlegesebb ízélményért. Lilahagyma helyett használhatunk újhagymát vagy salottahagymát is.	https://images.pexels.com/photos/30910213/pexels-photo-30910213.jpeg	0	15	1	t	2026-04-27 15:30:13.367635	2026-04-27 15:30:13.367635
9	9	Tonhalkrém (Zétény-féle)	Tonhalkrém mascarponéval és paradicsomszósszal, a mediteránabb ízekért.	Először apró kockákra vágjuk a hagymát, majd egy tálba tesszük.\nTálba mérjük a paradicsomszószt, és hozzátesszük a többi hozzávalót is.\nAlaposan összekeverjük és ehetjük is.	https://images.pexels.com/photos/5640048/pexels-photo-5640048.jpeg	0	15	1	t	2026-04-27 15:30:13.372493	2026-04-27 15:30:13.372493
10	10	Bolognai ragu	A legjobb bolognai recept!	A hagymát apróra vágjuk, vagy aprítóban összeaprítjuk.\nNagy edényben hevített olajra dobjuk a hagymát, hagyjuk amíg üveges nem lesz.\nA szárzellert és a répát is a kívánt módon aprítjuk és a hagymához adjuk a fokhagymával együtt. Folyamatosan kevergessük a zöldségeket (mirepoix), hogy ne piruljanak túl.\nNéhány perc után hozzáadjuk a paradicsompürét hagyjuk kicsit pirulni, keverjük át majd a darált húsokat. Ahogy a lábasba tesszük, ne kevergessük sűrűn, hagyjuk, hogy piruljon a hús.\n\nHa színt kapott a hús, hozzáadjuk a fűszereket (kivéve a babérlevelet és a bazsalikomot, ha friss bazsalikomot használunk) és a vörösbort. Mindenképpen száraz bort használjunk, és testesebb bort, hiszen ezekből kapjuk meg a megfelelő aromákat. A szép savszerkezeteket hagyjuk meg a nyári estékre, most válasszuk inkább a tanninokat. Cabernet Sauvignon, Shiraz. Utóbbiból inkább déli borvidékről válasszunk. Amennyiben 5 évnél idősebb a bor, érdemes kitölteni és állni hagyni mielőtt felhasználjuk egy széles szájú üvegben hogy kapjon elég oxigént.\n\nAlacsony lángon hagyjuk rotyogni a ragút, majd ha elforrt az alkohol, adjuk hozzá az alaplevet. Majd a babérlevelet a száránál gyújtsuk meg néhány pillanatra, így sokkal kellemesebb és erősebb lesz az íze. A friss bazsalikomot csak az utolsó néhány percben adjuk hozzá a raguhoz, ne vágjuk apróra, csak tépkedjük el kissé, majd csapjuk össze kezünkkel, így több ízt fog adni a ragunak.\n\nFedjük le a ragut, és hagyjuk rotyogni amíg időnk engedi.\n\nMikor főzzük a tésztát az ételhez, egy merőkanállal adjuk a raguhoz a főzővízből, hogy a tésztából kifőtt keményítőtől besűrűsödjön a ragu, így jobban odatapadjon a tésztához.\n\nExtra tipp: Ha van otthon valamilyen kérges keménysajtunk (Parmezán, pecorino, grana padano) a kérgét amit egyébként kidobnánk, tegyük bele a raguba főni, ezzel egyrészt kevesebb ételt pazarolunk, másrészt kitűnő ízt ad a ragunak.	https://images.pexels.com/photos/6287523/pexels-photo-6287523.jpeg	40	30	3	t	2026-04-27 15:30:13.377083	2026-04-27 15:30:13.377083
11	11	Paradicsomsaláta	Egyszerű és gyors paradicsomsaláta, nem lehet nem szeretni.	Szeleteljük fel vékony szeletekre a paradicsomot és a mozzarellát, majd egy szép tányéron felváltva rétegezzük a szeleteket.\nLocsoljuk meg olívaolajjal és balzsamecettel, fűszerezzük majd a végén szórjuk rá a kapribogyókat.	https://images.pexels.com/photos/9873742/pexels-photo-9873742.jpeg	0	15	1	t	2026-04-27 15:30:13.383327	2026-04-27 15:30:13.383327
\.


--
-- Data for Name: recipes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recipes (id, user_id, created_at) FROM stdin;
1	user_3CPE4WILkIU2vrqElJNKDPZ2GsH	2026-04-27 15:30:13.326885
2	user_3CPE4WILkIU2vrqElJNKDPZ2GsH	2026-04-27 15:30:13.335479
3	user_3CPE4WILkIU2vrqElJNKDPZ2GsH	2026-04-27 15:30:13.340917
4	user_3CPE4WILkIU2vrqElJNKDPZ2GsH	2026-04-27 15:30:13.345921
5	user_3CPE4WILkIU2vrqElJNKDPZ2GsH	2026-04-27 15:30:13.35244
6	user_3CPE4WILkIU2vrqElJNKDPZ2GsH	2026-04-27 15:30:13.356865
7	user_3CPE4WILkIU2vrqElJNKDPZ2GsH	2026-04-27 15:30:13.362669
8	user_3CPE4WILkIU2vrqElJNKDPZ2GsH	2026-04-27 15:30:13.367635
9	user_3CPE4WILkIU2vrqElJNKDPZ2GsH	2026-04-27 15:30:13.372493
10	user_3CPE4WILkIU2vrqElJNKDPZ2GsH	2026-04-27 15:30:13.377083
11	user_3CPCdO9xP7lG2xuj7xsd466sLdd	2026-04-27 15:30:13.383327
\.


--
-- Data for Name: saved_recipes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.saved_recipes (recipe_id, user_id, created_at) FROM stdin;
\.


--
-- Data for Name: units; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.units (id, abbreviation, name) FROM stdin;
1	g	Gramm
2	dkg	Dekagramm
3	kg	Kilogramm
4	ml	Milliliter
5	cl	Centiliter
6	dl	Deciliter
7	l	Liter
8	db	Darab
9	tk	Teáskanál
10	ek	Evőkanál
11	csipet	Csipet
12	pohár	Pohár
13	bögre	Bögre
14	csomag	Csomag
15	gerezd	Gerezd
16	szelet	Szelet
17	konzerv	Konzerv
18	csokor	Csokor
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: postgres
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 3, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 9, true);


--
-- Name: ingredients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ingredients_id_seq', 230, true);


--
-- Name: recipe_data_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recipe_data_id_seq', 11, true);


--
-- Name: recipes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recipes_id_seq', 11, true);


--
-- Name: units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.units_id_seq', 18, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: postgres
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: admins admins_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_user_id_unique UNIQUE (user_id);


--
-- Name: categories categories_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_unique UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: category_recipe category_recipe_recipe_id_category_id_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category_recipe
    ADD CONSTRAINT category_recipe_recipe_id_category_id_pk PRIMARY KEY (recipe_id, category_id);


--
-- Name: default_ingredients default_ingredients_user_id_ingredient_id_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.default_ingredients
    ADD CONSTRAINT default_ingredients_user_id_ingredient_id_pk PRIMARY KEY (user_id, ingredient_id);


--
-- Name: ingredient_recipe_data ingredient_recipe_data_recipe_data_id_ingredient_id_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient_recipe_data
    ADD CONSTRAINT ingredient_recipe_data_recipe_data_id_ingredient_id_pk PRIMARY KEY (recipe_data_id, ingredient_id);


--
-- Name: ingredients ingredients_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredients
    ADD CONSTRAINT ingredients_name_unique UNIQUE (name);


--
-- Name: ingredients ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredients
    ADD CONSTRAINT ingredients_pkey PRIMARY KEY (id);


--
-- Name: recipe_data recipe_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_data
    ADD CONSTRAINT recipe_data_pkey PRIMARY KEY (id);


--
-- Name: recipes recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_pkey PRIMARY KEY (id);


--
-- Name: saved_recipes saved_recipes_user_id_recipe_id_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saved_recipes
    ADD CONSTRAINT saved_recipes_user_id_recipe_id_pk PRIMARY KEY (user_id, recipe_id);


--
-- Name: units units_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_name_unique UNIQUE (name);


--
-- Name: units units_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_pkey PRIMARY KEY (id);


--
-- Name: categories_fts_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX categories_fts_idx ON public.categories USING gin (to_tsvector('hungarian'::regconfig, (name)::text));


--
-- Name: categories_name_trgm_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX categories_name_trgm_idx ON public.categories USING gin (name public.gin_trgm_ops);


--
-- Name: ingredients_fts_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ingredients_fts_idx ON public.ingredients USING gin (to_tsvector('hungarian'::regconfig, (name)::text));


--
-- Name: ingredients_name_trgm_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ingredients_name_trgm_idx ON public.ingredients USING gin (name public.gin_trgm_ops);


--
-- Name: recipe_data_description_trgm_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX recipe_data_description_trgm_idx ON public.recipe_data USING gin (description public.gin_trgm_ops);


--
-- Name: recipe_data_fts_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX recipe_data_fts_idx ON public.recipe_data USING gin (((setweight(to_tsvector('hungarian'::regconfig, (title)::text), 'A'::"char") || setweight(to_tsvector('hungarian'::regconfig, description), 'B'::"char"))));


--
-- Name: recipe_data_title_trgm_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX recipe_data_title_trgm_idx ON public.recipe_data USING gin (title public.gin_trgm_ops);


--
-- Name: units_abbreviation_trgm_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX units_abbreviation_trgm_idx ON public.units USING gin (abbreviation public.gin_trgm_ops);


--
-- Name: units_fts_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX units_fts_idx ON public.units USING gin (((setweight(to_tsvector('hungarian'::regconfig, (name)::text), 'A'::"char") || setweight(to_tsvector('hungarian'::regconfig, (abbreviation)::text), 'B'::"char"))));


--
-- Name: units_name_trgm_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX units_name_trgm_idx ON public.units USING gin (name public.gin_trgm_ops);


--
-- Name: category_recipe category_recipe_category_id_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category_recipe
    ADD CONSTRAINT category_recipe_category_id_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: category_recipe category_recipe_recipe_id_recipes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category_recipe
    ADD CONSTRAINT category_recipe_recipe_id_recipes_id_fk FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: default_ingredients default_ingredients_ingredient_id_ingredients_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.default_ingredients
    ADD CONSTRAINT default_ingredients_ingredient_id_ingredients_id_fk FOREIGN KEY (ingredient_id) REFERENCES public.ingredients(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: ingredient_recipe_data ingredient_recipe_data_ingredient_id_ingredients_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient_recipe_data
    ADD CONSTRAINT ingredient_recipe_data_ingredient_id_ingredients_id_fk FOREIGN KEY (ingredient_id) REFERENCES public.ingredients(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: ingredient_recipe_data ingredient_recipe_data_recipe_data_id_recipe_data_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient_recipe_data
    ADD CONSTRAINT ingredient_recipe_data_recipe_data_id_recipe_data_id_fk FOREIGN KEY (recipe_data_id) REFERENCES public.recipe_data(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ingredient_recipe_data ingredient_recipe_data_unit_id_units_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient_recipe_data
    ADD CONSTRAINT ingredient_recipe_data_unit_id_units_id_fk FOREIGN KEY (unit_id) REFERENCES public.units(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: recipe_data recipe_data_recipe_id_recipes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_data
    ADD CONSTRAINT recipe_data_recipe_id_recipes_id_fk FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: saved_recipes saved_recipes_recipe_id_recipes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saved_recipes
    ADD CONSTRAINT saved_recipes_recipe_id_recipes_id_fk FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict uHoqnIZwb0Bmx5i6PavS3y1WkO2kCJE10eMBZcqvODdNE5yd3UjwbveAk7dmKvb

