

import { DAYS_OF_WEEK_IN_ORDER } from "@/constants"
import { relations } from "drizzle-orm"
import { boolean, index, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

const createdAt = timestamp("createAt").notNull().defaultNow()

const updatedAt = timestamp("updatedAt")
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date())

export const EventTable = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    durationInMinutes: integer("durationInMinutes").notNull(),
    clerkUserId: text("clerkUserId").notNull(),
    isActive: boolean("isActive").notNull().default(true),
    startDateTime: timestamp("startDateTime"),
    status: text("status").default('confirmed'),
    timeZone: text("timeZone"),
    createdAt,
    updatedAt,
  },
  table => ([
    index("clerkUserIdIndex").on(table.clerkUserId),
  ])
,)

export const ScheduleTable = pgTable("schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  timeZone: text("timezone").notNull(),
  clerkUserId: text("clerkUserId").notNull().unique(),
  createdAt,
  updatedAt,
})

export const scheduleRelations = relations(ScheduleTable, ({ many }) => ({
  availabilities: many(ScheduleAvailabilityTable), 
}))

export const scheduleDayOfWeekEnum = pgEnum("day", DAYS_OF_WEEK_IN_ORDER)

export const ScheduleAvailabilityTable = pgTable(
  "scheduleAvailabilities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    scheduleId: uuid("scheduleId")
    .notNull()
    .references(() => ScheduleTable.id, {onDelete: "cascade"}),

    startTime: text("startTime").notNull(), 
    endTime: text("endTime").notNull(),
    dayOfWeek: scheduleDayOfWeekEnum("dayOfWeek").notNull(),
  },
  table => ([
    index("scheduleIdIndex").on(table.scheduleId),
  ])
)

export const ScheduleAvailabilityRelations = relations(
  ScheduleAvailabilityTable,
  ({ one }) => ({
    schedule: one(ScheduleTable, {
      fields: [ScheduleAvailabilityTable.scheduleId],
      references: [ScheduleTable.id],
    }),
  })
)

export const BookingTable = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("eventId").notNull().references(() => EventTable.id, { onDelete: "cascade" }),
    guestName: text("guestName").notNull(),
    guestEmail: text("guestEmail").notNull(),
    startDateTime: timestamp("startDateTime").notNull(),
    durationInMinutes: integer("durationInMinutes").notNull(),
    status: text("status").default('confirmed'),
    createdAt,
    updatedAt,
  }
);