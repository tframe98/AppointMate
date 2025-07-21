"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';

interface Booking {
  id: string;
  eventName: string;
  guestName: string;
  startDateTime: string;
  status: string;
  eventId: string;
}

const BookingsPage = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    setLoading(true);
    fetch(`/api/booking?clerkUserId=${user.id}`)
      .then(res => res.json())
      .then((data) => setBookings(data))
      .finally(() => setLoading(false));
  }, [isLoaded, isSignedIn, user?.id]);

  const handleCancel = async (id: string) => {
    setLoading(true);
    const res = await fetch('/api/booking', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
      toast.success('Booking cancelled');
    } else {
      toast.error('Failed to cancel booking');
    }
    setLoading(false);
  };

  if (!isLoaded) return <div className="p-8 text-center">Loading user...</div>;
  if (!isSignedIn) return <div className="p-8 text-center">Please sign in.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Bookings</h1>
        <Link href="/dashboard" className="text-blue-600 hover:underline">Back to Dashboard</Link>
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
        <div className="bg-white rounded-lg shadow p-4">
          <ul className="divide-y">
            {bookings.map(b => (
              <li key={b.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="font-semibold text-lg">{b.eventName || b.eventId}</div>
                  <div className="text-sm text-gray-500">Guest: {b.guestName}</div>
                  <div className="text-xs">{new Date(b.startDateTime).toLocaleString()}</div>
                  <div className={`text-xs mt-1 ${b.status === 'cancelled' ? 'text-red-500' : 'text-green-600'}`}>{b.status}</div>
                </div>
                <div>
                  {b.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded font-semibold hover:bg-red-200 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </li>
            ))}
            {bookings.length === 0 && <li className="text-gray-400 py-4">No bookings yet.</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BookingsPage; 