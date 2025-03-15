import React, { useState, useEffect } from 'react';
import { request } from '../api/api';
import '../styles/EmployeeSchedule.css'; 

const EmployeeSchedule = ({ date }) => {
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatDate = (date) => date.toISOString().split('T')[0]; // Ensures proper date formatting (YYYY-MM-DD)

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await request(`/api/schedule?date=${formatDate(date)}`, 'GET');
        setSchedule(data);
      } catch (err) {
        console.error('Failed to fetch schedule:', err);
        setError('Failed to load schedule. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [date]);

  if (loading) return <p>Loading schedule...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!Object.keys(schedule).length) return <p>No schedule available for this date.</p>;

  return (
    <div className="schedule-container">
      {Object.entries(schedule).map(([employee, appointments]) => (
        <div key={employee} className="employee-column">
          <div className="employee-name">{employee}</div>
          {appointments.map(appointment => (
            <div key={appointment.id} className="appointment" style={{ top: `${appointment.time * 50}px` }}>
              {appointment.clientName} - {appointment.service}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default EmployeeSchedule;