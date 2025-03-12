import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Employees from "./pages/Employees";
import Clients from "./pages/Clients";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Appointments from "./pages/Appointments";
import Signup from "./pages/SignUp"; 
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import AuthProvider from "./context/AuthContext";
const App = () => {
  return (
    
    <Router>
      <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <Clients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <Employees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />
      </Routes>
      </AuthProvider>
    </Router>
    
  );
};

export default App;