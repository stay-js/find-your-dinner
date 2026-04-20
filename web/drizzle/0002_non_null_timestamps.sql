ALTER TABLE "recipe_data" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "recipe_data" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "saved_recipes" ALTER COLUMN "created_at" SET NOT NULL;