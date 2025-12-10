import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Landing } from "./pages/Landing";
import { AdminLayout } from "./components/AdminLayout";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminSignup } from "./pages/AdminSignup";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminProjects } from "./pages/AdminProjects";
import { AdminClients } from "./pages/AdminClients";
import { AdminContact } from "./pages/AdminContact";
import { AdminNewsletter } from "./pages/AdminNewsletter";

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/signup" element={<AdminSignup />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Landing />} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
