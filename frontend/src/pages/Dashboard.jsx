import React, { useState } from "react";
import CalendarView from "../components/CalendarView";
import ClientEmployeeManagement from "../components/ClientEmployeeManagement";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import EmployeeForm from "../components/EmployeeForm";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  const handleAddEmployee = () => {
    setShowEmployeeModal(true);
  };

  const closeEmployeeModal = () => {
    setShowEmployeeModal(false);
  };

  const handleAddClient = () => {
    navigate("/clients");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Business Dashboard</h1>
        <p>Manage your appointments, clients, and employees.</p>

        <div className="dashboard-actions">
          <button className="dashboard-btn" onClick={handleAddEmployee} aria-label="Add Employee">
            Add Employee
          </button>
          <button className="dashboard-btn" onClick={handleAddClient} aria-label="Add Client">
            Add Client
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="dashboard-section calendar-section">
          <h2>Calendar</h2>
          <CalendarView />
        </section>

        <section className="dashboard-section management-section">
          <h2>Client & Employee Management</h2>
          <ClientEmployeeManagement />
        </section>
      </div>

      {showEmployeeModal && (
        <EmployeeForm onClose={closeEmployeeModal} refreshEmployees={() => console.log("Refresh employees")} />
      )}
    </div>
  );
};

export default Dashboard;