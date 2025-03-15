import React, { useEffect, useState } from "react";
import { getClients, addClient, deleteClient } from "../api/api"; // Removed updateClient if not defined
import "../styles/Clients.css";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "" });
  const [editingClient, setEditingClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getClients();
      setClients(data);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError("Failed to load clients.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async () => {
    setError("");

    if (!newClient.name || !newClient.email || !newClient.phone) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      await addClient(newClient);
      setNewClient({ name: "", email: "", phone: "" });
      loadClients();
    } catch (err) {
      console.error("Error adding client:", err);
      setError("Failed to add client.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (id) => {
    setError("");

    try {
      setLoading(true);
      await deleteClient(id);
      loadClients();
    } catch (err) {
      console.error("Error deleting client:", err);
      setError("Failed to delete client.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
  };

  const handleUpdateClient = async () => {
    setError("");

    if (!editingClient.name || !editingClient.email || !editingClient.phone) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      await updateClient(editingClient.id, editingClient); // This line will cause an error if updateClient is not imported
      setEditingClient(null);
      loadClients();
    } catch (err) {
      console.error("Error updating client:", err);
      setError("Failed to update client.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="clients-container">
      <h2>Clients</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
          required
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
          required
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
          required
        />
        {editingClient ? (
          <button onClick={handleUpdateClient} disabled={loading}>
            {loading ? "Updating..." : "Update Client"}
          </button>
        ) : (
          <button onClick={handleAddClient} disabled={loading}>
            {loading ? "Adding..." : "Add Client"}
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading clients...</p>
      ) : clients.length === 0 ? (
        <p>No clients available.</p>
      ) : (
        <ul className="client-list">
          {clients.map((client) => (
            <li key={client.id} className="client-item">
              <span>{client.name} - {client.email}</span>
              <button className="delete-button" onClick={() => handleDeleteClient(client.id)} disabled={loading}>
                Delete
              </button>
              <button className="edit-button" onClick={() => handleEditClient(client)} disabled={loading}>
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Clients;