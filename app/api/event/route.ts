import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { EventTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

// CREATE event type
export async function POST(req: NextRequest) {
  const { name, description, durationInMinutes, clerkUserId, isActive } = await req.json();
  try {
    const [event] = await db.insert(EventTable).values({
      name,
      description,
      durationInMinutes,
      clerkUserId,
      isActive: isActive ?? true,
    }).returning();
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event type', details: error }, { status: 500 });
  }
}

// UPDATE event type
export async function PUT(req: NextRequest) {
  const { id, name, description, durationInMinutes, isActive } = await req.json();
  try {
    const [event] = await db.update(EventTable)
      .set({ name, description, durationInMinutes, isActive })
      .where(EventTable.id.eq(id))
      .returning();
    if (!event) return NextResponse.json({ error: 'Event type not found' }, { status: 404 });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update event type', details: error }, { status: 500 });
  }
}

// DELETE event type
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  try {
    const [event] = await db.delete(EventTable)
      .where(EventTable.id.eq(id))
      .returning();
    if (!event) return NextResponse.json({ error: 'Event type not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete event type', details: error }, { status: 500 });
  }
}

// GET: List all event types for a user
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clerkUserId = searchParams.get('clerkUserId');
  if (!clerkUserId) return NextResponse.json({ error: 'Missing clerkUserId' }, { status: 400 });
  const events = await db.query.EventTable.findMany({
    where: eq(EventTable.clerkUserId, clerkUserId),
  });
  return NextResponse.json(events);
} 