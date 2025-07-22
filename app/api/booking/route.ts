import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { BookingTable, EventTable } from '@/drizzle/schema';
import { eq, inArray } from 'drizzle-orm';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
const FROM_EMAIL = process.env.SMTP_FROM!;

async function sendConfirmationEmail({ guestEmail, guestName, event, startDateTime }: any) {
  try {
    await transporter.sendMail({
      to: guestEmail,
      from: FROM_EMAIL,
      subject: `Booking Confirmed: ${event.name}`,
      text: `Hi ${guestName},\n\nYour booking for '${event.name}' is confirmed.\n\nDate & Time: ${new Date(startDateTime).toLocaleString()}\n\nThank you!`,
      html: `<p>Hi ${guestName},</p><p>Your booking for <b>${event.name}</b> is confirmed.</p><p><b>Date & Time:</b> ${new Date(startDateTime).toLocaleString()}</p><p>Thank you!</p>`,
    });
  } catch (err) {
    console.error('Nodemailer error (guest):', err);
  }
}

async function sendHostNotification({ hostEmail, guestName, guestEmail, event, startDateTime }: any) {
  if (!hostEmail) return;
  try {
    await transporter.sendMail({
      to: hostEmail,
      from: FROM_EMAIL,
      subject: `New Booking for ${event.name}`,
      text: `A new booking was made by ${guestName} (${guestEmail}) for '${event.name}'.\n\nDate & Time: ${new Date(startDateTime).toLocaleString()}`,
      html: `<p>A new booking was made by <b>${guestName}</b> (${guestEmail}) for <b>${event.name}</b>.</p><p><b>Date & Time:</b> ${new Date(startDateTime).toLocaleString()}</p>`,
    });
  } catch (err) {
    console.error('Nodemailer error (host):', err);
  }
}

// GET: List all bookings for a user
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clerkUserId = searchParams.get('clerkUserId');
  if (!clerkUserId) return NextResponse.json({ error: 'Missing clerkUserId' }, { status: 400 });
  // Find all events for this user
  const events = await db.query.EventTable.findMany({ where: eq(EventTable.clerkUserId, clerkUserId) });
  const eventIds = events.map(e => e.id);
  // Find all bookings for these events
  const bookings = eventIds.length > 0
    ? await db.query.BookingTable.findMany({ where: inArray(BookingTable.eventId, eventIds) })
    : [];
  return NextResponse.json(bookings);
}

// POST: Create a new booking
export async function POST(req: NextRequest) {
  const { eventId, guestName, guestEmail, startDateTime, durationInMinutes } = await req.json();
  if (!eventId || !guestName || !guestEmail || !startDateTime || !durationInMinutes) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  // Get event metadata
  const event = await db.query.EventTable.findFirst({ where: eq(EventTable.id, eventId) });
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  // Store booking
  const [booking] = await db.insert(BookingTable).values({
    eventId,
    guestName,
    guestEmail,
    startDateTime,
    durationInMinutes,
    status: 'confirmed',
  }).returning();
  // Send confirmation email to guest
  await sendConfirmationEmail({ guestEmail, guestName, event, startDateTime });
  // Send notification to host (if event has hostEmail field, otherwise skip)
  if (event.hostEmail) {
    await sendHostNotification({ hostEmail: event.hostEmail, guestName, guestEmail, event, startDateTime });
  }
  return NextResponse.json({ booking, success: true }, { status: 201 });
}

// DELETE: Cancel a booking
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const [booking] = await db.delete(EventTable)
    .where(eq(EventTable.id, id))
    .returning();
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}

// PATCH: Cancel a booking by ID
export async function PATCH(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const [booking] = await db.update(BookingTable)
    .set({ status: 'cancelled' })
    .where(eq(BookingTable.id, id))
    .returning();
  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  return NextResponse.json({ success: true, booking });
} 