CREATE INDEX "recipe_data_fts_idx" ON "recipe_data" USING gin ((
        setweight(to_tsvector('hungarian', "title"), 'A') ||
        setweight(to_tsvector('hungarian', "description"), 'B')
        ));