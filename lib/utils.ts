import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import parse from 'date-fns/parse';
import { addMinutes, isBefore, isAfter, format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Compute free slots for each day given availability and bookings.
 * @param availability Array<{ dayOfWeek: string, startTime: string, endTime: string }>
 * @param bookings Array<{ startDateTime: string, durationInMinutes: number }>
 * @returns Record<dayOfWeek, Array<{ startTime: string, endTime: string }>>
 */
export function computeFreeSlots(
  availability: Array<{ dayOfWeek: string; startTime: string; endTime: string }>,
  bookings: Array<{ startDateTime: string; durationInMinutes: number }>
): Record<string, Array<{ startTime: string; endTime: string }>> {
  // Group bookings by dayOfWeek
  const bookingsByDay: Record<string, Array<{ start: string; end: string }>> = {};
  bookings.forEach(b => {
    const date = new Date(b.startDateTime);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const start = format(date, 'HH:mm');
    const end = format(addMinutes(date, b.durationInMinutes), 'HH:mm');
    if (!bookingsByDay[dayOfWeek]) bookingsByDay[dayOfWeek] = [];
    bookingsByDay[dayOfWeek].push({ start, end });
  });

  // For each day, subtract bookings from availability
  const freeSlots: Record<string, Array<{ startTime: string; endTime: string }>> = {};
  for (const { dayOfWeek, startTime, endTime } of availability) {
    let slots = [{ start: startTime, end: endTime }];
    const bookings = bookingsByDay[dayOfWeek] || [];
    // Sort bookings by start time
    bookings.sort((a, b) => a.start.localeCompare(b.start));
    // Subtract each booking from slots
    for (const booking of bookings) {
      const newSlots: typeof slots = [];
      for (const slot of slots) {
        const bookingEnd = parse(booking.end, 'HH:mm', new Date());
        const slotStart = parse(slot.start, 'HH:mm', new Date());
        const bookingStart = parse(booking.start, 'HH:mm', new Date());
        const slotEnd = parse(slot.end, 'HH:mm', new Date());
        if (isBefore(bookingEnd, slotStart) ||
            isAfter(bookingStart, slotEnd)) {
          // No overlap
          newSlots.push(slot);
        } else {
          // Overlap: split slot
          if (isBefore(slotStart, bookingStart)) {
            newSlots.push({ start: slot.start, end: booking.start });
          }
          if (isAfter(slotEnd, bookingEnd)) {
            newSlots.push({ start: booking.end, end: slot.end });
          }
        }
      }
      slots = newSlots;
    }
    if (!freeSlots[dayOfWeek]) freeSlots[dayOfWeek] = [];
    freeSlots[dayOfWeek].push(...slots.map(s => ({ startTime: s.start, endTime: s.end })));
  }
  return freeSlots;
}
