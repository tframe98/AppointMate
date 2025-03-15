import { useState, useEffect } from 'react';
import { request } from '../api/api';
import '../styles/ClientList.css';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchClients = async () => {
    try {
      const data = await request('/api/clients', 'GET');
      setClients(data);
    } catch (err) {
      console.error('Failed to fetch clients:', err);
      setError('Failed to load clients.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p>Loading clients...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="client-list-container">
      <h2>Client Contact List</h2>
      <input
        type="text"
        placeholder="Search clients by name or email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      {filteredClients.length === 0 ? (
        <p>No clients found.</p>
      ) : (
        <table className="client-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Total Appointments</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.phone || 'N/A'}</td>
                <td>{client.appointments?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClientList;