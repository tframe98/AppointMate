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
    color: "#007bff", 
  });

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to load employees.");
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setClientData({ ...clientData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Basic validation
    if (!clientData.name || !clientData.email || !clientData.service || !clientData.date || !clientData.time || !clientData.employeeId) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      await addClient(clientData);
      setSuccessMessage("Client successfully added!");
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Error adding client:", err);
      setError("Failed to add client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add Client</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Client Name" value={clientData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Client Email" value={clientData.email} onChange={handleChange} required />
        <input type="text" name="service" placeholder="Service Type" value={clientData.service} onChange={handleChange} required />
        <label>Choose Service Color:</label>
        <input type="color" name="color" value={clientData.color} onChange={handleChange} />
        <input type="date" name="date" value={clientData.date} onChange={handleChange} required />
        <input type="time" name="time" value={clientData.time} onChange={handleChange} required />
        <select name="employeeId" value={clientData.employeeId} onChange={handleChange} required>
          <option value="">Select Employee</option>
          {employees.length > 0 ? (
            employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))
          ) : (
            <option disabled>Loading employees...</option>
          )}
        </select>

        <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Add Client"}</button>
      </form>
    </div>
  );
};

export default AddClientForm;