const AppointmentList = ({ appointments }) => {
  return (
    <ul className="appointment-list">
      {appointments.map((appt) => (
        <li key={appt.id} className="appointment-item">
          <strong>{appt.service}</strong>
          <p>
            {new Date(appt.date).toLocaleDateString()} -{' '}
            {new Date(appt.date).toLocaleTimeString()}
          </p>
          <p>Status: {appt.status}</p>
        </li>
      ))}
    </ul>
  );
};

export default AppointmentList;