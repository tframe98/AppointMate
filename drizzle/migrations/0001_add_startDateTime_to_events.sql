ALTER TABLE "events" ADD COLUMN "startDateTime" timestamp;
ALTER TABLE "events" ADD COLUMN "status" text DEFAULT 'confirmed'; 