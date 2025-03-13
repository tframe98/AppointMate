import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const AppointmentForm = ({ onAppointmentCreated }) => {
  const [date, setDate] = useState('');
  const [service, setService] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        `${API_BASE_URL}/api/appointments/create`,
        { date, service },
        { headers: { Authorization: token } }
      );
      setDate('');
      setService('');
      onAppointmentCreated(); 
    } catch (error) {
      console.error('Failed to create appointment.', error);
    }
  };

  return (
    <form className="appointment-form" onSubmit={handleSubmit}>
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

      <button type="submit">Book Appointment</button>
    </form>
  );
};

export default AppointmentForm;