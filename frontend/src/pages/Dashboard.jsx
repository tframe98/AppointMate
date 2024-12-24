import CustomCalendar from '../components/CalendarView';
import ClientEmployeeManagement from '../components/ClientEmployeeManagement';


const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Business Dashboard</h1>
      <CustomCalendar />
      <ClientEmployeeManagement />
    </div>
  );
};

export default Dashboard;