import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ClientEmployeeManagement.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const ClientEmployeeManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('All');
  const [employees, setEmployees] = useState([]);

  const fetchAppointments = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/appointments/employee-appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  };

  const fetchEmployees = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchEmployees();
  }, []);

  const filteredAppointments = selectedEmployee === 'All'
    ? appointments
    : appointments.filter((appt) => appt.employee?.name === selectedEmployee);

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
      </div>
    </div>
  );
};

export default ClientEmployeeManagement;