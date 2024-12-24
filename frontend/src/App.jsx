import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../src/pages/Home';
import Auth from '../src/pages/Auth';
import Dashboard from '../src/pages/Dashboard';
import ProtectedRoute from '../src/components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;