CREATE TABLE `admins` (
	`user_id` varchar(256) NOT NULL,
	CONSTRAINT `admins_user_id_unique` UNIQUE(`user_id`)
);
