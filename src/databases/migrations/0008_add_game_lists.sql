CREATE TABLE `game_list_items` (
	`list_id` text NOT NULL,
	`rom_id` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_game_list_items_list_rom` ON `game_list_items` (`list_id`,`rom_id`);--> statement-breakpoint
CREATE INDEX `idx_game_list_items_list_status_order` ON `game_list_items` (`list_id`,`status`,`sort_order`);--> statement-breakpoint
CREATE INDEX `idx_game_list_items_user_rom_status` ON `game_list_items` (`user_id`,`rom_id`,`status`);--> statement-breakpoint
CREATE TABLE `game_lists` (
	`description` text,
	`name` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_game_lists_user_status_created` ON `game_lists` (`user_id`,`status`,`created_at`);