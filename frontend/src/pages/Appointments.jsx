import React, { useEffect, useState } from "react";
import { getAppointments, createAppointment } from "../api/api";
import "../styles/Appointments.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({ date: "", clientId: "", serviceId: "" });

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    const data = await getAppointments();
    setAppointments(data);
  };

  const handleCreateAppointment = async () => {
    await createAppointment(newAppointment);
    setNewAppointment({ date: "", clientId: "", serviceId: "" });
    loadAppointments();
  };

  return (
    <div className="appointments-container">
      <h2>Appointments</h2>
      <input
        type="datetime-local"
        value={newAppointment.date}
        onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
      />
      <button onClick={handleCreateAppointment}>Create Appointment</button>

      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id}>{appointment.date}</li>
        ))}
      </ul>
    </div>
  );
};

export default Appointments;