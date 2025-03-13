import React, { useEffect, useState } from 'react';
import { getAppointments, getEmployees } from '../api/api';
import '../styles/CalendarView.css';

const CalendarView = () => {
  const [appointments, setAppointments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsData = await getAppointments();
        setAppointments(appointmentsData);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        setError(err.message);
      }
    };

    const fetchEmployees = async () => {
      try {
        const employeesData = await getEmployees();
        setEmployees(employeesData);
      } catch (err) {
        console.error('Failed to fetch employees:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
    fetchEmployees();
  }, []);

  if (loading) return <div className="loading">Loading calendar...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="calendar-container">
      <h2>Today's Schedule - {new Date().toLocaleDateString()}</h2>
      <div className="calendar-grid">
        {employees.map((employee) => (
          <div key={employee.id} className="calendar-column">
            <div className="employee-name">{employee.name}</div>
            {appointments
              .filter((appt) => appt.employeeId === employee.id)
              .map((appt) => (
                <div key={appt.id} className="appointment-card" style={{ backgroundColor: appt.color }}>
                  <div className="appointment-time">{appt.time}</div>
                  <div className="appointment-client">{appt.clientName}</div>
                  <div className="appointment-service">{appt.service}</div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;