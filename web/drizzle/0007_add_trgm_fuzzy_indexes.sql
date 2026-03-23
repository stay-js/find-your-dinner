CREATE INDEX "categories_name_trgm_idx" ON "categories" USING gin ("name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "ingredients_name_trgm_idx" ON "ingredients" USING gin ("name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "recipe_data_title_trgm_idx" ON "recipe_data" USING gin ("title" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "recipe_data_description_trgm_idx" ON "recipe_data" USING gin ("description" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "units_name_trgm_idx" ON "units" USING gin ("name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "units_abbreviation_trgm_idx" ON "units" USING gin ("abbreviation" gin_trgm_ops);