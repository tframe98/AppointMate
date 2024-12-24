import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/EmployeeSchedule.css'; // Ensure you create corresponding CSS

const EmployeeSchedule = ({ date }) => {
  const [schedule, setSchedule] = useState({});
  const formatDate = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/schedule?date=${formatDate(date)}`);
        setSchedule(response.data);
      } catch (error) {
        console.error('Failed to fetch schedule:', error);
      }
    };

    fetchSchedule();
  }, [date]);

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