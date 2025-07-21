"use client";
import React, { useEffect, useState } from 'react';
import { DAYS_OF_WEEK_IN_ORDER } from '@/constants';
import { useUser } from '@clerk/nextjs';

interface TimeBlock {
  id?: string;
  startTime: string;
  endTime: string;
}

interface DayAvailability {
  day: string;
  blocks: TimeBlock[];
}

const initialAvailability: DayAvailability[] = DAYS_OF_WEEK_IN_ORDER.map(day => ({
  day,
  blocks: [],
}));

export default function AvailabilityPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [availability, setAvailability] = useState<DayAvailability[]>(initialAvailability);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load availability from API
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    setLoading(true);
    fetch(`/api/availability?clerkUserId=${user.id}`)
      .then(res => res.json())
      .then((data: any[]) => {
        // Group by day
        const byDay: Record<string, TimeBlock[]> = {};
        data.forEach(a => {
          if (!byDay[a.dayOfWeek]) byDay[a.dayOfWeek] = [];
          byDay[a.dayOfWeek].push({ id: a.id, startTime: a.startTime, endTime: a.endTime });
        });
        setAvailability(DAYS_OF_WEEK_IN_ORDER.map(day => ({
          day,
          blocks: byDay[day] || [],
        })));
        setSelectedDays(Object.keys(byDay));
      })
      .finally(() => setLoading(false));
  }, [isLoaded, isSignedIn, user?.id]);

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleTimeChange = (day: string, idx: number, field: 'startTime' | 'endTime', value: string) => {
    setAvailability(prev =>
      prev.map(d =>
        d.day === day
          ? {
              ...d,
              blocks: d.blocks.map((block, i) =>
                i === idx ? { ...block, [field]: value } : block
              ),
            }
          : d
      )
    );
  };

  const handleAddBlock = (day: string) => {
    setAvailability(prev =>
      prev.map(d =>
        d.day === day
          ? { ...d, blocks: [...d.blocks, { startTime: '', endTime: '' }] }
          : d
      )
    );
  };

  const handleRemoveBlock = (day: string, idx: number) => {
    setAvailability(prev =>
      prev.map(d =>
        d.day === day
          ? { ...d, blocks: d.blocks.filter((_, i) => i !== idx) }
          : d
      )
    );
  };

  const handleSave = async () => {
    if (!isLoaded || !isSignedIn) return;
    setSaving(true);
    // 1. Delete all existing blocks for this user
    const res = await fetch(`/api/availability?clerkUserId=${user.id}`);
    const existing = await res.json();
    await Promise.all(existing.map((a: any) =>
      fetch('/api/availability', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: a.id }),
      })
    ));
    // 2. Create new blocks
    const toCreate = availability
      .filter(d => selectedDays.includes(d.day))
      .flatMap(d => d.blocks.map(b => ({
        clerkUserId: user.id,
        dayOfWeek: d.day,
        startTime: b.startTime,
        endTime: b.endTime,
      })));
    await Promise.all(toCreate.map(block =>
      fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(block),
      })
    ));
    setSaving(false);
    alert('Saved!');
  };

  if (!isLoaded) return <div>Loading user...</div>;
  if (!isSignedIn) return <div>Please sign in to manage your availability.</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Set Your Working Hours</h1>
      {loading ? <div>Loading availability...</div> : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-2">
            {DAYS_OF_WEEK_IN_ORDER.map(day => (
              <label key={day} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedDays.includes(day)}
                  onChange={() => handleDayToggle(day)}
                />
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </label>
            ))}
          </div>
          {selectedDays.map(day => {
            const dayAvail = availability.find(d => d.day === day)!;
            return (
              <div key={day} className="mb-4 border rounded p-3">
                <div className="font-semibold mb-2">{day.charAt(0).toUpperCase() + day.slice(1)}</div>
                {dayAvail.blocks.map((block, idx) => (
                  <div key={block.id || idx} className="flex items-center gap-2 mb-2">
                    <input
                      type="time"
                      value={block.startTime}
                      onChange={e => handleTimeChange(day, idx, 'startTime', e.target.value)}
                      className="border p-1 rounded"
                      required
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={block.endTime}
                      onChange={e => handleTimeChange(day, idx, 'endTime', e.target.value)}
                      className="border p-1 rounded"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveBlock(day, idx)}
                      className="text-red-600 ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddBlock(day)}
                  className="text-blue-600 mt-1"
                >
                  + Add Time Block
                </button>
              </div>
            );
          })}
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </>
      )}
    </div>
  );
} 