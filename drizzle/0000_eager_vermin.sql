CREATE TABLE `response_cache` (
	`cache_key` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `response_cache_expires` ON `response_cache` (`expires`);--> statement-breakpoint
CREATE TABLE `usage_limits` (
	`bucket` text NOT NULL,
	`window` integer NOT NULL,
	`hits` integer NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`bucket`, `window`)
);
--> statement-breakpoint
CREATE INDEX `usage_limits_expires` ON `usage_limits` (`expires`);