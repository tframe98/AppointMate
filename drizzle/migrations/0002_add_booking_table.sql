CREATE TABLE "bookings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "eventId" uuid NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
  "guestName" text NOT NULL,
  "guestEmail" text NOT NULL,
  "startDateTime" timestamp NOT NULL,
  "durationInMinutes" integer NOT NULL,
  "status" text DEFAULT 'confirmed',
  "createAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
); 