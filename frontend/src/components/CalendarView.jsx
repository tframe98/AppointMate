import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CalendarView.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const CustomCalendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [employees, setEmployees] = useState([]);

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API_BASE_URL}/api/appointments`, {
        headers: { Authorization: token },
      });
      const formattedAppointments = response.data.map((appt) => ({
        title: appt.service, // ✅ Show service name as title
        start: appt.date,
        extendedProps: {
          employee: appt.employeeName || "Unassigned",
          client: appt.clientName || "Unknown",
          color: appt.color, // ✅ Use stored color
        },
      }));
      setAppointments(formattedAppointments);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  const fetchEmployees = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API_BASE_URL}/api/employees`, {
        headers: { Authorization: token },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchEmployees();
  }, []);

  return (
    <div className="custom-calendar-container">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,timeGridDay",
        }}
        events={appointments}
        eventContent={(eventInfo) => (
          <div style={{ backgroundColor: eventInfo.event.extendedProps.color, color: "#fff", padding: "5px", borderRadius: "4px" }}>
            <strong>{eventInfo.timeText}</strong>
            <div>{eventInfo.event.title}</div>
          </div>
        )}
      />
    </div>
  );
};

export default CustomCalendar;