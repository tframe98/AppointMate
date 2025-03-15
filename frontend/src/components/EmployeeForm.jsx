import React, { useState } from "react";
import { addEmployee } from "../api/api";
import "../styles/EmployeeForm.css";

const EmployeeForm = ({ onClose, refreshEmployees }) => {
  const [employeeData, setEmployeeData] = useState({
    name: "",
    email: "",
    password: "",
    position: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Basic validation
    if (!employeeData.name || !employeeData.email || !employeeData.password || !employeeData.position) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      await addEmployee(employeeData);
      setSuccessMessage("Employee successfully added!");
      refreshEmployees();
      setTimeout(() => onClose(), 1000);
    } catch (error) {
      console.error("Error adding employee:", error);
      setError("Failed to add employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Add New Employee</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            value={employeeData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={employeeData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={employeeData.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="position"
            placeholder="Position"
            value={employeeData.position}
            onChange={handleChange}
            required
          />

          <div className="modal-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Employee"}
            </button>
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;