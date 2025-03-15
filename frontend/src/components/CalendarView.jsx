import React, { useState, useEffect } from 'react';
import { getEmployees } from '../api/api';
import '../styles/CalendarView.css';

const formatHour = hour => {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  return `${hour > 12 ? hour - 12 : hour} ${suffix}`;
};

const CalendarView = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const fetchedEmployees = await getEmployees();
        setEmployees(fetchedEmployees);
        setError('');
      } catch (error) {
        console.error('Failed to fetch employees:', error);
        setError('Failed to load employees.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handlePrevDay = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + 1);
      return newDate;
    });
  };

  const hours = Array.from({ length: 11 }, (_, i) => 8 + i); // From 8 AM to 6 PM

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button className="calendar-nav" onClick={handlePrevDay}>‹</button>
        <h2>{currentDate.toLocaleDateString()}</h2>
        <button className="calendar-nav" onClick={handleNextDay}>›</button>
      </div>
      <div className="calendar-grid">
        <div className="time-column">
          <div className="header-cell"></div>
          {hours.map(hour => (
            <div key={hour} className="time-cell">
              {formatHour(hour)}
            </div>
          ))}
        </div>
        {employees.map(employee => (
          <div key={employee.id} className="employee-column">
            <div className="header-cell">{employee.name}</div>
            {hours.map(hour => (
              <div key={hour} className="appointment-cell"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;