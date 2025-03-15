import React, { useEffect, useState } from "react";
import { getAppointments, createAppointment } from "../api/api";
import "../styles/Appointments.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({ date: "", clientId: "", serviceId: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppointment = async () => {
    setError("");
    setSuccessMessage("");

    // Validate input
    if (!newAppointment.date || !newAppointment.clientId || !newAppointment.serviceId) {
      setError("All fields are required.");
      return;
    }

    try {
      await createAppointment(newAppointment);
      setSuccessMessage("Appointment successfully created!");
      setNewAppointment({ date: "", clientId: "", serviceId: "" });
      loadAppointments();
    } catch (err) {
      console.error("Error creating appointment:", err);
      setError("Failed to create appointment. Please try again.");
    }
  };

  return (
    <div className="appointments-container">
      <h2>Appointments</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <input
        type="datetime-local"
        value={newAppointment.date}
        onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
      />
      <input
        type="text"
        placeholder="Client ID"
        value={newAppointment.clientId}
        onChange={(e) => setNewAppointment({ ...newAppointment, clientId: e.target.value })}
      />
      <input
        type="text"
        placeholder="Service ID"
        value={newAppointment.serviceId}
        onChange={(e) => setNewAppointment({ ...newAppointment, serviceId: e.target.value })}
      />
      <button onClick={handleCreateAppointment} disabled={loading}>
        {loading ? "Creating..." : "Create Appointment"}
      </button>

      {loading ? (
        <p>Loading appointments...</p>
      ) : (
        <ul>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <li key={appointment.id}>{appointment.date}</li>
            ))
          ) : (
            <p>No appointments found.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Appointments;