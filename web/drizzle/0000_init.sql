CREATE TABLE `ingredient_recipe_data` (
	`recipe_data_id` bigint unsigned NOT NULL,
	`ingredient_id` bigint unsigned NOT NULL,
	`quantity` float unsigned NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ingredient_recipe_data_recipe_data_id_ingredient_id_pk` PRIMARY KEY(`recipe_data_id`,`ingredient_id`)
);
--> statement-breakpoint
CREATE TABLE `ingredients` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`unit` varchar(64) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ingredients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recipe_data` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`recipe_id` bigint unsigned NOT NULL,
	`title` varchar(512) NOT NULL,
	`description` text NOT NULL,
	`instructions` text NOT NULL,
	`prep_time_minutes` int unsigned NOT NULL,
	`cook_time_minutes` int unsigned NOT NULL,
	`servings` int unsigned NOT NULL,
	`verified` boolean NOT NULL DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `recipe_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`user_id` varchar(256) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `recipes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `saved_recipes` (
	`user_id` varchar(256) NOT NULL,
	`recipe_id` bigint unsigned NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `saved_recipes_user_id_recipe_id_pk` PRIMARY KEY(`user_id`,`recipe_id`)
);
--> statement-breakpoint
ALTER TABLE `ingredient_recipe_data` ADD CONSTRAINT `ingredient_recipe_data_recipe_data_id_recipe_data_id_fk` FOREIGN KEY (`recipe_data_id`) REFERENCES `recipe_data`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ingredient_recipe_data` ADD CONSTRAINT `ingredient_recipe_data_ingredient_id_ingredients_id_fk` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `recipe_data` ADD CONSTRAINT `recipe_data_recipe_id_recipes_id_fk` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `saved_recipes` ADD CONSTRAINT `saved_recipes_recipe_id_recipes_id_fk` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `idx_recipe_data_recipe_id` ON `recipe_data` (`recipe_id`);
