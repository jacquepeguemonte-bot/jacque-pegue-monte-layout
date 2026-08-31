ALTER TABLE `google_review_sync` ADD `accountId` varchar(255);--> statement-breakpoint
ALTER TABLE `google_review_sync` ADD `locationId` varchar(255);--> statement-breakpoint
ALTER TABLE `google_review_sync` ADD `refreshTokenCiphertext` text;