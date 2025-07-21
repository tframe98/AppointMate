"use client";
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface EventType {
  id: string;
  name: string;
  description: string;
  durationInMinutes: number;
  isActive: boolean;
  clerkUserId: string;
}

const EventTypesPage = () => {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [form, setForm] = useState<Partial<EventType>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch all event types (GET not implemented in API, so mock for now)
  useEffect(() => {
    // TODO: Replace with real fetch when GET is implemented
    // fetch('/api/event').then(...)
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { ...form, id: editingId } : form;
    const res = await fetch('/api/event', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      // TODO: Refresh list
      setForm({});
      setEditingId(null);
      toast.success(editingId ? 'Event type updated' : 'Event type created');
    } else {
      toast.error('Failed to save event type');
    }
    setLoading(false);
  };

  const handleEdit = (event: EventType) => {
    setForm(event);
    setEditingId(event.id);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    const res = await fetch('/api/event', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      // TODO: Refresh list
      toast.success('Event type deleted');
    } else {
      toast.error('Failed to delete event type');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Event Types</h1>
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          name="name"
          placeholder="Title"
          value={form.name || ''}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="durationInMinutes"
          type="number"
          placeholder="Duration (minutes)"
          value={form.durationInMinutes || ''}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Intro text"
          value={form.description || ''}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
          {editingId ? 'Update' : 'Create'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setForm({}); setEditingId(null); }} className="ml-2 px-4 py-2 rounded border">
            Cancel
          </button>
        )}
      </form>
      <ul className="space-y-2">
        {eventTypes.map(event => (
          <li key={event.id} className="border p-2 rounded flex justify-between items-center">
            <div>
              <div className="font-semibold">{event.name}</div>
              <div className="text-sm text-gray-600">{event.description}</div>
              <div className="text-xs">Duration: {event.durationInMinutes} min</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(event)} className="text-blue-600">Edit</button>
              <button onClick={() => handleDelete(event.id)} className="text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventTypesPage; 