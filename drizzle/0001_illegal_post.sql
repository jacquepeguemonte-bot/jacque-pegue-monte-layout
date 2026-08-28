CREATE TABLE `google_review_sync` (
	`id` int AUTO_INCREMENT NOT NULL,
	`status` enum('not_connected','connected','error') NOT NULL DEFAULT 'not_connected',
	`profileName` varchar(255),
	`lastSyncedAt` timestamp,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `google_review_sync_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `google_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reviewId` varchar(255) NOT NULL,
	`reviewerName` varchar(255) NOT NULL,
	`reviewerPhotoUrl` text,
	`rating` int NOT NULL,
	`comment` text NOT NULL,
	`publishedAt` timestamp NOT NULL,
	`updatedAt` timestamp,
	`reply` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `google_reviews_id` PRIMARY KEY(`id`),
	CONSTRAINT `google_reviews_reviewId_unique` UNIQUE(`reviewId`)
);
