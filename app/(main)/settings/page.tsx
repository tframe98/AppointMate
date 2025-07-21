"use client";
import { useUser } from '@clerk/nextjs';
import React, { useState } from 'react';

const timeZones = [
  'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Kolkata', 'Australia/Sydney',
  'UTC',
];

const SettingsPage = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [saving, setSaving] = useState(false);
  // TODO: Fetch/store timeZone in DB for real app
  // TODO: Fetch Google Calendar integration status
  const googleConnected = false; // mock

  const handleTimeZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeZone(e.target.value);
    // TODO: Save to DB
  };

  const handleGoogleConnect = () => {
    window.location.href = '/api/auth/google';
  };

  if (!isLoaded) return <div className="p-8 text-center">Loading user...</div>;
  if (!isSignedIn) return <div className="p-8 text-center">Please sign in.</div>;

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-6">Profile & Settings</h1>
      <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Name</label>
          <input value={user.fullName || ''} disabled className="w-full border p-2 rounded bg-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input value={user.primaryEmailAddress?.emailAddress || ''} disabled className="w-full border p-2 rounded bg-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Time Zone</label>
          <select value={timeZone} onChange={handleTimeZoneChange} className="w-full border p-2 rounded">
            {timeZones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-semibold">Google Calendar:</span>
          {googleConnected ? (
            <span className="text-green-600">Connected</span>
          ) : (
            <button onClick={handleGoogleConnect} className="bg-green-100 text-green-700 px-4 py-2 rounded font-semibold hover:bg-green-200 transition">Connect</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 