import React, { useState, useEffect } from "react";
import { getEmployees, addClient } from "../api/api";

const AddClientForm = ({ onClose }) => {
  const [clientData, setClientData] = useState({
    name: "",
    email: "",
    service: "",
    date: "",
    time: "",
    employeeId: "",
    color: "#007bff", // Default color
  });

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const data = await getEmployees();
      setEmployees(data);
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setClientData({ ...clientData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addClient(clientData);
    onClose();
  };

  return (
    <div>
      <h2>Add Client</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Client Name" value={clientData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Client Email" value={clientData.email} onChange={handleChange} required />

        {/* ✅ Allow typing in the service name */}
        <input type="text" name="service" placeholder="Service Type" value={clientData.service} onChange={handleChange} required />

        {/* ✅ Allow selecting a custom color */}
        <label>Choose Service Color:</label>
        <input type="color" name="color" value={clientData.color} onChange={handleChange} />

        <input type="date" name="date" value={clientData.date} onChange={handleChange} required />
        <input type="time" name="time" value={clientData.time} onChange={handleChange} required />

        <select name="employeeId" value={clientData.employeeId} onChange={handleChange} required>
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>

        <button type="submit">Add Client</button>
      </form>
    </div>
  );
};

export default AddClientForm;