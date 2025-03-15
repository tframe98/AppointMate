const AppointmentList = ({ appointments = [] }) => {
  if (!appointments.length) {
    return <p>No appointments scheduled.</p>;
  }

  return (
    <ul className="appointment-list">
      {appointments.map((appt) => {
        const dateObj = new Date(appt.date);
        const formattedDate = dateObj.toLocaleDateString();
        const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
          <li key={appt.id} className="appointment-item">
            <strong>{appt.service || "No service specified"}</strong>
            <p>
              {formattedDate} - {formattedTime}
            </p>
            <p>Status: {appt.status || "Unknown"}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default AppointmentList;