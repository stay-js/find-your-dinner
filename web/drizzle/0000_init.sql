CREATE TABLE "admins" (
	"user_id" varchar(256) NOT NULL,
	CONSTRAINT "admins_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "category_recipe" (
	"recipe_id" bigserial NOT NULL,
	"category_id" bigserial NOT NULL,
	CONSTRAINT "category_recipe_recipe_id_category_id_pk" PRIMARY KEY("recipe_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "ingredient_recipe_data" (
	"recipe_data_id" bigserial NOT NULL,
	"ingredient_id" bigserial NOT NULL,
	"quantity" double precision NOT NULL,
	"unit_id" bigserial NOT NULL,
	CONSTRAINT "ingredient_recipe_data_recipe_data_id_ingredient_id_pk" PRIMARY KEY("recipe_data_id","ingredient_id")
);
--> statement-breakpoint
CREATE TABLE "ingredients" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	CONSTRAINT "ingredients_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "recipe_data" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"recipe_id" bigserial NOT NULL,
	"title" varchar(512) NOT NULL,
	"preview_image_url" varchar(2048) NOT NULL,
	"description" text NOT NULL,
	"instructions" text NOT NULL,
	"prep_time_minutes" integer NOT NULL,
	"cook_time_minutes" integer NOT NULL,
	"servings" integer NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "saved_recipes" (
	"user_id" varchar(256) NOT NULL,
	"recipe_id" bigserial NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "saved_recipes_user_id_recipe_id_pk" PRIMARY KEY("user_id","recipe_id")
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(64) NOT NULL,
	"abbreviation" varchar(16) NOT NULL,
	CONSTRAINT "units_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "category_recipe" ADD CONSTRAINT "category_recipe_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "category_recipe" ADD CONSTRAINT "category_recipe_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "ingredient_recipe_data" ADD CONSTRAINT "ingredient_recipe_data_recipe_data_id_recipe_data_id_fk" FOREIGN KEY ("recipe_data_id") REFERENCES "public"."recipe_data"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ingredient_recipe_data" ADD CONSTRAINT "ingredient_recipe_data_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "ingredient_recipe_data" ADD CONSTRAINT "ingredient_recipe_data_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "recipe_data" ADD CONSTRAINT "recipe_data_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "saved_recipes" ADD CONSTRAINT "saved_recipes_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE cascade;