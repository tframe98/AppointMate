const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

// Helper function for API calls
const request = async (endpoint, method = "GET", body = null) => {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("token");

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  return response.json();
};
// Register API
export const registerUser = async (userData) => {
  try {
    const response = await fetch("http://localhost:5001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    console.log("Signup Response:", data); // ✅ Debugging log

    if (data.token) {
      localStorage.setItem("token", data.token); // ✅ Store token
      return { success: true, user: data.user, token: data.token };
    }

    return { success: false, error: data.error || "Registration failed" };
  } catch (error) {
    console.error("Error in registerUser:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
};

//Business Owner Api
export const createBusinessProfile = async (businessData) => {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:5001/api/business/setup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, 
    },
    body: JSON.stringify(businessData),
  });

  return response.json();
};

// Client API
export const getClients = () => request("/api/clients");
export const addClient = (clientData) => request("/api/clients/add", "POST", clientData); 
export const deleteClient = (id) => request(`/api/clients/${id}`, "DELETE"); 

// Employee API
export const getEmployees = () => request("/api/employees");
export const addEmployee = (employeeData) => request("/api/employees/add", "POST", employeeData); 
export const deleteEmployee = (id) => request(`/api/employees/${id}`, "DELETE");

// Appointment API
export const getAppointments = () => request("/api/appointments");
export const createAppointment = (appointmentData) => request("/api/appointments/add", "POST", appointmentData); 
export const updateAppointmentStatus = (id, status) =>
  request(`/api/appointments/${id}/status`, "PATCH", { status }); 


// Authentication API
export const loginUser = async (credentials) => {
  const response = await request("/api/auth/login", "POST", credentials);
  if (response.token) {
    localStorage.setItem("token", response.token);
  }
  return response;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token; 
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return { error: "No token found" };
    }

    const response = await fetch("http://localhost:5001/api/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // ✅ Check if response is okay
    if (!response.ok) {
      console.error("Error fetching user:", response.status);
      return { error: `Server returned ${response.status}` };
    }

    // ✅ Ensure we are parsing JSON correctly
    const data = await response.json();
    console.log("Fetched User Data:", data);
    return data;

  } catch (error) {
    console.error("Error fetching current user:", error);
    return { error: "Failed to fetch user" };
  }
};

export default {
  getEmployees,  
  addEmployee,  
  deleteEmployee,
  getClients,
  addClient,  
  deleteClient,
  getAppointments, 
  createAppointment, 
  updateAppointmentStatus,
  registerUser, 
  loginUser,
  logoutUser,
  isAuthenticated, 
  getCurrentUser,
};