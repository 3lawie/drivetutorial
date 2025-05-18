CREATE TABLE `drive_tutorial_files_table` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`size` bigint unsigned NOT NULL,
	`url` text NOT NULL,
	`fileKey` text,
	`parent` bigint unsigned NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `drive_tutorial_files_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `parent_index` ON `drive_tutorial_files_table` (`parent`);--> statement-breakpoint
CREATE INDEX `owner_id_index` ON `drive_tutorial_files_table` (`owner_id`);--> statement-breakpoint
CREATE TABLE `drive_tutorial_folders_table` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`parent` bigint unsigned,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `drive_tutorial_folders_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `parent_index` ON `drive_tutorial_folders_table` (`parent`);--> statement-breakpoint
CREATE INDEX `owner_id_index` ON `drive_tutorial_folders_table` (`owner_id`);