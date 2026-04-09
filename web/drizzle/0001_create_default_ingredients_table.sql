CREATE TABLE "default_ingredients" (
	"user_id" varchar(256) NOT NULL,
	"ingredient_id" bigint NOT NULL,
	CONSTRAINT "default_ingredients_user_id_ingredient_id_pk" PRIMARY KEY("user_id","ingredient_id")
);
--> statement-breakpoint
ALTER TABLE "default_ingredients" ADD CONSTRAINT "default_ingredients_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE restrict ON UPDATE restrict;