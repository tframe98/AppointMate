import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { ScheduleAvailabilityTable, ScheduleTable } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';

// GET: List all availabilities for a user (by clerkUserId)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clerkUserId = searchParams.get('clerkUserId');
  if (!clerkUserId) return NextResponse.json({ error: 'Missing clerkUserId' }, { status: 400 });
  // Find schedule for user
  const schedule = await db.query.ScheduleTable.findFirst({ where: eq(ScheduleTable.clerkUserId, clerkUserId) });
  if (!schedule) return NextResponse.json([]);
  const availabilities = await db.query.ScheduleAvailabilityTable.findMany({ where: eq(ScheduleAvailabilityTable.scheduleId, schedule.id) });
  return NextResponse.json(availabilities);
}

// POST: Create new availability block
export async function POST(req: NextRequest) {
  const { clerkUserId, dayOfWeek, startTime, endTime } = await req.json();
  if (!clerkUserId || !dayOfWeek || !startTime || !endTime) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  // Find or create schedule for user
  let schedule = await db.query.ScheduleTable.findFirst({ where: eq(ScheduleTable.clerkUserId, clerkUserId) });
  if (!schedule) {
    [schedule] = await db.insert(ScheduleTable).values({ clerkUserId, timeZone: 'UTC' }).returning();
  }
  const [availability] = await db.insert(ScheduleAvailabilityTable).values({
    scheduleId: schedule.id,
    dayOfWeek,
    startTime,
    endTime,
  }).returning();
  return NextResponse.json(availability, { status: 201 });
}

// PUT: Update an availability block
export async function PUT(req: NextRequest) {
  const { id, startTime, endTime } = await req.json();
  if (!id || !startTime || !endTime) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const [availability] = await db.update(ScheduleAvailabilityTable)
    .set({ startTime, endTime })
    .where(eq(ScheduleAvailabilityTable.id, id))
    .returning();
  if (!availability) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(availability);
}

// DELETE: Remove an availability block
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const [availability] = await db.delete(ScheduleAvailabilityTable)
    .where(eq(ScheduleAvailabilityTable.id, id))
    .returning();
  if (!availability) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
} 