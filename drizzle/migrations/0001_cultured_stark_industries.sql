ALTER TABLE "events" ADD COLUMN "startDateTime" timestamp;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "status" text DEFAULT 'confirmed';