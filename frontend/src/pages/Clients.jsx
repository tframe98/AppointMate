import React, { useEffect, useState } from "react";
import { getClients, addClient, deleteClient } from "../api/api";
import "../styles/Clients.css";


const Clients = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "" });
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const data = await getClients();
    setClients(data);
  };

  const handleAddClient = async () => {
    await addClient(newClient);
    setNewClient({ name: "", email: "", phone: "" });
    loadClients();
  };

  const handleDeleteClient = async (id) => {
    await deleteClient(id);
    loadClients();
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
  };

  const handleUpdateClient = async () => {
    await updateClient(editingClient.id, editingClient);
    setEditingClient(null);
    loadClients();
  };

  return (
    <div className="clients-container">
      <h2>Clients</h2>
      <div className="client-form">
        <input
          type="text"
          placeholder="Name"
          value={editingClient ? editingClient.name : newClient.name}
          onChange={(e) => {
            const value = e.target.value;
            editingClient
              ? setEditingClient({ ...editingClient, name: value })
              : setNewClient({ ...newClient, name: value });
          }}
        />
        <input
          type="email"
          placeholder="Email"
          value={editingClient ? editingClient.email : newClient.email}
          onChange={(e) => {
            const value = e.target.value;
            editingClient
              ? setEditingClient({ ...editingClient, email: value })
              : setNewClient({ ...newClient, email: value });
          }}
        />
        <input
          type="text"
          placeholder="Phone"
          value={editingClient ? editingClient.phone : newClient.phone}
          onChange={(e) => {
            const value = e.target.value;
            editingClient
              ? setEditingClient({ ...editingClient, phone: value })
              : setNewClient({ ...newClient, phone: value });
          }}
        />
        {editingClient ? (
          <button onClick={handleUpdateClient}>Update Client</button>
        ) : (
          <button onClick={handleAddClient}>Add Client</button>
        )}
      </div>

      <ul className="client-list">
        {clients.map((client) => (
          <li key={client.id} className="client-item">
            <span>{client.name} - {client.email}</span>
            <button className="delete-button" onClick={() => handleDeleteClient(client.id)}>
              Delete
            </button>
            <button className="edit-button" onClick={() => handleEditClient(client)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Clients;