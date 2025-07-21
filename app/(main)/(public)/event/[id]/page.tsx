import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { computeFreeSlots } from '@/lib/utils';
import { DAYS_OF_WEEK_IN_ORDER } from '@/constants';

function getDayOfWeek(date: Date) {
  return date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
}

function isPastDate(dateStr: string) {
  const today = new Date();
  const date = new Date(dateStr);
  today.setHours(0,0,0,0);
  date.setHours(0,0,0,0);
  return date < today;
}

export default function EventBookingPage() {
  const params = useParams();
  const eventId = params?.id as string;
  const [event, setEvent] = useState<any>(null);
  const [availability, setAvailability] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [freeSlots, setFreeSlots] = useState<{ startTime: string; endTime: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch event metadata
  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    fetch(`/api/event?id=${eventId}`)
      .then(res => res.json())
      .then(data => setEvent(data))
      .finally(() => setLoading(false));
  }, [eventId]);

  // Fetch availability and bookings for event owner
  useEffect(() => {
    if (!event) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/availability?clerkUserId=${event.clerkUserId}`).then(res => res.json()),
      fetch(`/api/booking?clerkUserId=${event.clerkUserId}`).then(res => res.json()),
    ]).then(([avail, books]) => {
      setAvailability(avail);
      setBookings(books);
    }).finally(() => setLoading(false));
  }, [event]);

  // Compute free slots for selected date
  useEffect(() => {
    if (!selectedDate || !availability.length) return;
    const date = new Date(selectedDate);
    const dayOfWeek = getDayOfWeek(date);
    // Filter availability for the selected day
    const availForDay = availability.filter((a: any) => a.dayOfWeek === dayOfWeek);
    // Filter bookings for the selected date
    const bookingsForDay = bookings.filter((b: any) => {
      const bDate = new Date(b.startDateTime);
      return bDate.toDateString() === date.toDateString();
    });
    // Compute free slots
    const slots = computeFreeSlots(
      availForDay.map((a: any) => ({
        dayOfWeek: a.dayOfWeek,
        startTime: a.startTime,
        endTime: a.endTime,
      })),
      bookingsForDay.map((b: any) => ({
        startDateTime: b.startDateTime,
        durationInMinutes: b.durationInMinutes,
      }))
    );
    setFreeSlots(slots[dayOfWeek] || []);
  }, [selectedDate, availability, bookings]);

  // Generate time slots for the day based on event duration
  function generateTimeSlots(freeSlots: { startTime: string; endTime: string }[], duration: number) {
    const slots: string[] = [];
    for (const slot of freeSlots) {
      let start = slot.startTime;
      while (true) {
        const startDate = new Date(`1970-01-01T${start}:00`);
        const endDate = new Date(startDate.getTime() + duration * 60000);
        const end = endDate.toTimeString().slice(0,5);
        if (end > slot.endTime) break;
        slots.push(start);
        start = end;
      }
    }
    return slots;
  }

  // Check if a slot is disabled (already booked or in the past)
  function isSlotDisabled(time: string): boolean {
    if (!selectedDate) return true;
    const now = new Date();
    const slotDate = new Date(`${selectedDate}T${time}:00`);
    if (slotDate < now) return true;
    // Check if slot overlaps with any booking
    const duration = event.durationInMinutes;
    const slotEnd = new Date(slotDate.getTime() + duration * 60000);
    return bookings.some((b: any) => {
      const bDate = new Date(b.startDateTime);
      const bEnd = new Date(bDate.getTime() + b.durationInMinutes * 60000);
      return (
        bDate.toDateString() === slotDate.toDateString() &&
        ((slotDate >= bDate && slotDate < bEnd) || (slotEnd > bDate && slotEnd <= bEnd))
      );
    });
  }

  // Helper to format a time string in a given time zone
  function formatTimeInZone(dateStr: string, timeStr: string, timeZone: string) {
    const [hour, minute] = timeStr.split(':');
    const date = new Date(dateStr + 'T' + timeStr + ':00');
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit', minute: '2-digit', timeZone, hour12: false
    }).format(date);
  }

  const hostTimeZone = event?.timeZone || 'UTC';
  const guestTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  async function handleBook(time: string) {
    if (!bookingName || !bookingEmail) {
      setBookingStatus('Please enter your name and email.');
      return;
    }
    setSubmitting(true);
    setBookingStatus(null);
    // Compose startDateTime
    const startDateTime = `${selectedDate}T${time}:00`;
    const res = await fetch('/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: event.id,
        guestName: bookingName,
        guestEmail: bookingEmail,
        startDateTime,
        durationInMinutes: event.durationInMinutes,
      }),
    });
    if (res.ok) {
      setBookingStatus('thankyou');
    } else {
      setBookingStatus('Booking failed. Please try another slot.');
    }
    setSubmitting(false);
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <svg className="animate-spin h-8 w-8 text-blue-600 mr-2" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      <span className="text-blue-700 text-lg">Loading...</span>
    </div>
  );
  if (!event) return <div>Event not found.</div>;

  if (bookingStatus === 'thankyou') {
    return (
      <div className="max-w-lg mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Thank you for booking!</h1>
        <p className="mb-2">A confirmation email has been sent to <span className="font-semibold">{bookingEmail}</span>.</p>
        <p>We look forward to seeing you at your appointment.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md min-h-[90vh] flex flex-col">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words">{event.name}</h1>
      <div className="mb-2 text-gray-600 text-base sm:text-lg break-words">{event.description}</div>
      <div className="mb-4 text-sm sm:text-base">Duration: {event.durationInMinutes} min</div>
      <div className="mb-4 text-sm text-blue-900 bg-blue-50 rounded p-2">
        <div><b>Host time zone:</b> {hostTimeZone}</div>
        <div><b>Your local time zone:</b> {guestTimeZone}</div>
        <div className="text-xs text-blue-700">All times below are shown in both time zones for clarity.</div>
      </div>
      <form className="mb-4 flex flex-col gap-3" autoComplete="off">
        <input
          type="text"
          placeholder="Your name"
          value={bookingName}
          onChange={e => setBookingName(e.target.value)}
          className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
          required
          aria-label="Your name"
        />
        <input
          type="email"
          placeholder="Your email"
          value={bookingEmail}
          onChange={e => setBookingEmail(e.target.value)}
          className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
          required
          aria-label="Your email"
        />
      </form>
      <label className="block mb-2 font-semibold text-base sm:text-lg">Select a date:</label>
      <input
        type="date"
        value={selectedDate}
        min={new Date().toISOString().split('T')[0]}
        onChange={e => setSelectedDate(e.target.value)}
        className="border p-3 rounded mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
        aria-label="Select a date"
      />
      {selectedDate && (
        <div>
          <div className="mb-2 font-semibold text-base sm:text-lg">Available Time Slots:</div>
          <div className="flex flex-col gap-3">
            {generateTimeSlots(freeSlots, event.durationInMinutes).length === 0 && (
              <span className="text-gray-500">No available slots</span>
            )}
            {generateTimeSlots(freeSlots, event.durationInMinutes).map(time => (
              <button
                key={time}
                className={`flex flex-col items-start px-4 py-3 rounded-lg border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 text-left ${isSlotDisabled(time) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'}`}
                disabled={isSlotDisabled(time) || submitting}
                onClick={() => handleBook(time)}
                aria-label={`Book slot at ${formatTimeInZone(selectedDate, time, hostTimeZone)}`}
                tabIndex={isSlotDisabled(time) ? -1 : 0}
              >
                <span className="font-medium"><b>Host:</b> {formatTimeInZone(selectedDate, time, hostTimeZone)} ({hostTimeZone})</span>
                <span className="text-xs"><b>Your time:</b> {formatTimeInZone(selectedDate, time, guestTimeZone)} ({guestTimeZone})</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {bookingStatus && <div className="mt-4 text-center font-semibold text-base sm:text-lg">{bookingStatus}</div>}
      {/* TODO: Handle daylight saving adjustments if needed */}
    </div>
  );
} 