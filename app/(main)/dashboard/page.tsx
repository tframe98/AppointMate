"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface EventType {
  id: string;
  name: string;
  description: string;
  durationInMinutes: number;
  isActive: boolean;
}

interface Booking {
  id: string;
  eventName: string;
  guestName: string;
  startDateTime: string;
  status: string;
}

const DashboardPage = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/event?clerkUserId=${user.id}`).then(res => res.json()),
      fetch(`/api/booking?clerkUserId=${user.id}`).then(res => res.json()),
    ]).then(([events, bookingsRaw]) => {
      setEventTypes(events);
      // Map bookings to include event name
      const eventMap = Object.fromEntries(events.map((e: EventType) => [e.id, e.name]));
      setBookings(bookingsRaw.map((b: any) => ({
        ...b,
        eventName: eventMap[b.eventId] || 'Event',
      })));
      setLoading(false);
    });
    // Onboarding banner logic
    if (typeof window !== 'undefined') {
      setShowOnboarding(localStorage.getItem('onboardingDismissed') !== 'true');
    }
  }, [isLoaded, isSignedIn, user?.id]);

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboardingDismissed', 'true');
    }
  };

  if (!isLoaded) return <div className="p-8 text-center">Loading user...</div>;
  if (!isSignedIn) return <div className="p-8 text-center">Please sign in.</div>;

  // Analytics
  const totalBookings = bookings.length;
  const upcomingBookings = bookings.filter(b => new Date(b.startDateTime) > new Date() && b.status !== 'cancelled').length;
  const totalEventTypes = eventTypes.length;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      {showOnboarding && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="font-semibold text-blue-900 mb-1">Welcome to your Appointment Dashboard!</div>
            <ul className="list-disc pl-5 text-blue-900 text-sm">
              <li>Create your event types (meeting templates).</li>
              <li>Set your availability so clients can book you.</li>
              <li>Share your event links or book a test appointment.</li>
              <li>Connect Google Calendar for automatic sync.</li>
              <li>Manage bookings and profile from the dashboard.</li>
            </ul>
          </div>
          <button onClick={dismissOnboarding} className="ml-2 px-4 py-2 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition">Dismiss</button>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {/* Analytics widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{totalBookings}</div>
          <div className="text-sm text-blue-900">Total Bookings</div>
        </div>
        <div className="bg-green-100 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{upcomingBookings}</div>
          <div className="text-sm text-green-900">Upcoming Bookings</div>
        </div>
        <div className="bg-purple-100 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-700">{totalEventTypes}</div>
          <div className="text-sm text-purple-900">Event Types</div>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <svg className="animate-spin h-8 w-8 text-blue-600 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="text-blue-700 text-lg">Loading...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Your Event Types</h2>
                <Link href="/event-types" className="text-blue-600 hover:underline text-sm">Manage</Link>
              </div>
              <ul className="divide-y">
                {eventTypes.map(e => (
                  <li key={e.id} className="py-2">
                    <div className="font-medium">{e.name}</div>
                    <div className="text-xs text-gray-500">{e.description}</div>
                    <div className="text-xs">Duration: {e.durationInMinutes} min</div>
                  </li>
                ))}
                {eventTypes.length === 0 && <li className="text-gray-400">No event types yet.</li>}
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
                <Link href="/bookings" className="text-blue-600 hover:underline text-sm">View All</Link>
              </div>
              <ul className="divide-y">
                {bookings.map(b => (
                  <li key={b.id} className="py-2">
                    <div className="font-medium">{b.guestName}</div>
                    <div className="text-xs text-gray-500">{b.eventName}</div>
                    <div className="text-xs">{new Date(b.startDateTime).toLocaleString()}</div>
                  </li>
                ))}
                {bookings.length === 0 && <li className="text-gray-400">No bookings yet.</li>}
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/event-types" className="bg-blue-600 text-white px-4 py-2 rounded text-center font-semibold hover:bg-blue-700 transition">Create/Edit Event Types</Link>
            <Link href="/availability" className="bg-blue-100 text-blue-700 px-4 py-2 rounded text-center font-semibold hover:bg-blue-200 transition">Set Your Availability</Link>
            <Link href="/api/auth/google" className="bg-green-100 text-green-700 px-4 py-2 rounded text-center font-semibold hover:bg-green-200 transition">Connect Google Calendar</Link>
            <Link href="/bookings" className="bg-purple-100 text-purple-700 px-4 py-2 rounded text-center font-semibold hover:bg-purple-200 transition">Manage Bookings</Link>
            <Link href="/settings" className="bg-gray-100 text-gray-700 px-4 py-2 rounded text-center font-semibold hover:bg-gray-200 transition">Profile & Settings</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage; 