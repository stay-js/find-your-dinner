CREATE INDEX "categories_fts_idx" ON "categories" USING gin (to_tsvector('hungarian', "name"));--> statement-breakpoint
CREATE INDEX "ingredients_fts_idx" ON "ingredients" USING gin (to_tsvector('hungarian', "name"));--> statement-breakpoint
CREATE INDEX "units_fts_idx" ON "units" USING gin ((
        setweight(to_tsvector('hungarian', "name"), 'A') ||
        setweight(to_tsvector('hungarian', "abbreviation"), 'B')
        ));