CREATE TABLE `units` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(64) NOT NULL,
	`abbreviation` varchar(16) NOT NULL,
	CONSTRAINT `units_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `ingredient_recipe_data` DROP FOREIGN KEY `ingredient_recipe_data_ingredient_id_ingredients_id_fk`;
--> statement-breakpoint
ALTER TABLE `ingredient_recipe_data` ADD `unit_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `ingredient_recipe_data` ADD CONSTRAINT `ingredient_recipe_data_unit_id_units_id_fk` FOREIGN KEY (`unit_id`) REFERENCES `units`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `ingredient_recipe_data` ADD CONSTRAINT `ingredient_recipe_data_ingredient_id_ingredients_id_fk` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `ingredients` DROP COLUMN `unit`;
