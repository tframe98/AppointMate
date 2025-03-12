import React, { useState } from "react";
import { addEmployee } from "../api/api";

const EmployeeForm = ({ onClose }) => {
  const [employeeData, setEmployeeData] = useState({
    name: "",
    email: "",
    position: "",
    password: "",
  });

  const handleChange = (e) => {
    setEmployeeData({ ...employeeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addEmployee(employeeData);
    onClose();
  };

  return (
    <div className="employee-form-container">
      <h2>Add Employee</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" value={employeeData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={employeeData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={employeeData.password} onChange={handleChange} required />
        <input type="text" name="position" placeholder="Position" value={employeeData.position} onChange={handleChange} required />

        <button type="submit">Create Employee</button>
        <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default EmployeeForm;