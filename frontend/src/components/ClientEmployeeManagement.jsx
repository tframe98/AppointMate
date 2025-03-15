import { useState, useEffect } from 'react';
import { getEmployees } from '../api/api';
import * as api from '../api/api'; // Ensure all named exports, including request, are accessible
import '../styles/ClientEmployeeManagement.css';

const ClientEmployeeManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('All');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      const data = await api.request('/api/appointments/employee-appointments', 'GET');
      setAppointments(data);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setError('Failed to load appointments.');
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      setError('Failed to load employees.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchAppointments(), fetchEmployees()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredAppointments = selectedEmployee === 'All'
    ? appointments
    : appointments.filter((appt) => appt.employee?.name === selectedEmployee);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="client-employee-container">
      <h2>Client-Employee Management</h2>
      <div className="filter-container">
        <label htmlFor="employee-select">Filter by Employee:</label>
        <select
          id="employee-select"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="All">All</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.name}>
              {emp.name}
            </option>
          ))}
        </select>
      </div>
      <div className="appointments-table">
        {filteredAppointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Employee</th>
                <th>Service</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appt) => (
                <tr key={appt.id}>
                  <td>{appt.client?.name || 'Unknown'}</td>
                  <td>{appt.employee?.name || 'Unassigned'}</td>
                  <td>{appt.service}</td>
                  <td>{new Date(appt.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ClientEmployeeManagement;