CREATE TABLE "admins" (
	"user_id" varchar(256) NOT NULL,
	CONSTRAINT "admins_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" varchar(128) NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "category_recipe" (
	"category_id" bigint NOT NULL,
	"recipe_id" bigint NOT NULL,
	CONSTRAINT "category_recipe_recipe_id_category_id_pk" PRIMARY KEY("recipe_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "ingredient_recipe_data" (
	"ingredient_id" bigint NOT NULL,
	"recipe_data_id" bigint NOT NULL,
	"unit_id" bigint NOT NULL,
	"quantity" double precision NOT NULL,
	CONSTRAINT "ingredient_recipe_data_recipe_data_id_ingredient_id_pk" PRIMARY KEY("recipe_data_id","ingredient_id")
);
--> statement-breakpoint
CREATE TABLE "ingredients" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ingredients_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" varchar(256) NOT NULL,
	CONSTRAINT "ingredients_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "recipe_data" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "recipe_data_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"recipe_id" bigint NOT NULL,
	"description" text NOT NULL,
	"instructions" text NOT NULL,
	"title" varchar(512) NOT NULL,
	"preview_image_url" varchar(2048) NOT NULL,
	"cook_time_minutes" integer NOT NULL,
	"prep_time_minutes" integer NOT NULL,
	"servings" integer NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "recipes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "saved_recipes" (
	"recipe_id" bigint NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "saved_recipes_user_id_recipe_id_pk" PRIMARY KEY("user_id","recipe_id")
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "units_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"abbreviation" varchar(16) NOT NULL,
	"name" varchar(64) NOT NULL,
	CONSTRAINT "units_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "category_recipe" ADD CONSTRAINT "category_recipe_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "category_recipe" ADD CONSTRAINT "category_recipe_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ingredient_recipe_data" ADD CONSTRAINT "ingredient_recipe_data_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "ingredient_recipe_data" ADD CONSTRAINT "ingredient_recipe_data_recipe_data_id_recipe_data_id_fk" FOREIGN KEY ("recipe_data_id") REFERENCES "public"."recipe_data"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ingredient_recipe_data" ADD CONSTRAINT "ingredient_recipe_data_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "recipe_data" ADD CONSTRAINT "recipe_data_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "saved_recipes" ADD CONSTRAINT "saved_recipes_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE cascade;