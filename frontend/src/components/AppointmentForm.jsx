import { useState } from 'react';
import { createAppointment } from '../api/api';

const AppointmentForm = ({ onAppointmentCreated }) => {
  const [date, setDate] = useState('');
  const [service, setService] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Basic validation
    if (!date || !service) {
      setError('Both date and service are required.');
      return;
    }

    try {
      setLoading(true);
      await createAppointment({ dateTime: date, service });
      setDate('');
      setService('');
      setSuccessMessage('Appointment successfully booked!');
      if (onAppointmentCreated) {
        onAppointmentCreated();
      }
    } catch (error) {
      console.error('Failed to create appointment.', error);
      setError('Failed to create appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="appointment-form" onSubmit={handleSubmit}>
      <h2>Book an Appointment</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <label htmlFor="date">Date & Time:</label>
      <input
        type="datetime-local"
        id="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <label htmlFor="service">Service:</label>
      <input
        type="text"
        id="service"
        placeholder="Service Name"
        value={service}
        onChange={(e) => setService(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Booking...' : 'Book Appointment'}
      </button>
    </form>
  );
};

export default AppointmentForm;