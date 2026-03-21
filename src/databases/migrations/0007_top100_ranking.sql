CREATE TABLE IF NOT EXISTS `top100_ranks` (
	`display_name` text NOT NULL,
	`normalized_name` text NOT NULL,
	`platform` text NOT NULL,
	`rank` integer NOT NULL,
	`created_at` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `idx_top100_platform_name` ON `top100_ranks` (`platform`,`normalized_name`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_top100_platform_rank` ON `top100_ranks` (`platform`,`rank`);
