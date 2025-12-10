import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { AdminLayout } from './components/AdminLayout';
import { AdminLogin } from './pages/AdminLogin';
import { AdminSignup } from './pages/AdminSignup';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminProjects } from './pages/AdminProjects';
import { AdminClients } from './pages/AdminClients';
import { AdminContact } from './pages/AdminContact';
import { AdminNewsletter } from './pages/AdminNewsletter';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/projects" replace />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="contact" element={<AdminContact />} />
          <Route path="newsletter" element={<AdminNewsletter />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
