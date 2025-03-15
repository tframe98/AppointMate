import React, { useEffect, useState } from "react";
import { getEmployees, addEmployee, deleteEmployee } from "../api/api";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ name: "", email: "", role: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async () => {
    setError("");

    if (!newEmployee.name || !newEmployee.email || !newEmployee.role) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      await addEmployee(newEmployee);
      setNewEmployee({ name: "", email: "", role: "" });
      loadEmployees();
    } catch (err) {
      console.error("Error adding employee:", err);
      setError("Failed to add employee.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (id) => {
    setError("");

    try {
      setLoading(true);
      await deleteEmployee(id);
      loadEmployees();
    } catch (err) {
      console.error("Error deleting employee:", err);
      setError("Failed to delete employee.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Employees</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <input
          type="text"
          placeholder="Name"
          value={newEmployee.name}
          onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newEmployee.email}
          onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Role"
          value={newEmployee.role}
          onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
          required
        />
        <button onClick={handleAddEmployee} disabled={loading}>
          {loading ? "Adding..." : "Add Employee"}
        </button>
      </div>

      {loading ? (
        <p>Loading employees...</p>
      ) : employees.length === 0 ? (
        <p>No employees available.</p>
      ) : (
        <ul>
          {employees.map((employee) => (
            <li key={employee.id}>
              {employee.name} - {employee.role}{" "}
              <button onClick={() => handleDeleteEmployee(employee.id)} disabled={loading}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Employees;