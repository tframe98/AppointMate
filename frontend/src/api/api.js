const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const request = async (endpoint, method = "GET", body = null) => {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("token");

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Request to ${endpoint} failed:`, data.error || response.statusText);
      throw new Error(data.error || "API request failed");
    }

    return data;
  } catch (error) {
    console.error(`Error in request to ${endpoint}:`, error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await request("/api/auth/register", "POST", userData);

    if (response.token) {
      localStorage.setItem("token", response.token);
      return { success: true, user: response.user, token: response.token };
    }

    return { success: false, error: response.error || "Registration failed" };
  } catch (error) {
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const createBusinessProfile = async (businessData) => {
  try {
    return await request("/api/business/setup", "POST", businessData);
  } catch (error) {
    console.error("Error creating business profile:", error);
    throw error;
  }
};

export const getClients = () => request("/api/clients");
export const addClient = (clientData) => request("/api/clients/add", "POST", clientData); 
export const deleteClient = (id) => request(`/api/clients/${id}`, "DELETE"); 
export const getEmployees = () => request("/api/employees");

export const addEmployee = async (employeeData) => {
  try {
    return await request("/api/employees/add", "POST", employeeData);
  } catch (error) {
    console.error("Error adding employee:", error);
    throw error;
  }
};

export const deleteEmployee = (id) => request(`/api/employees/${id}`, "DELETE");
export const getAppointments = () => request("/api/appointments");
export const createAppointment = (appointmentData) => request("/api/appointments/add", "POST", appointmentData); 
export const updateAppointmentStatus = (id, status) =>
  request(`/api/appointments/${id}/status`, "PATCH", { status }); 

export const loginUser = async (credentials) => {
  try {
    const response = await request("/api/auth/login", "POST", credentials);

    if (response.token) {
      localStorage.setItem("token", response.token);
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const getCurrentUser = async () => {
  try {
    return await request("/api/auth/me", "GET");
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