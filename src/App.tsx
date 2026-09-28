import { Navigate, Route, Routes } from "react-router";

import OverviewPage from "./pages/OverviewPage";
import InsulinsPage from "./pages/InsulinsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SettingsPage from "./pages/SettingsPage";
import { getToken } from "./services/api";

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/register"
        element={<RegisterPage />}
      />
      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      />
      <Route
        path="/reset-password"
        element={<ResetPasswordPage />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <OverviewPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/insulinas"
        element={
          <ProtectedRoute>
            <InsulinsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/aplicacoes"
        element={<Navigate to="/insulinas" replace />}
      />
      <Route
        path="/estoque"
        element={<Navigate to="/insulinas" replace />}
      />
      <Route
        path="/historico"
        element={<Navigate to="/insulinas" replace />}
      />
      <Route
        path="/relatorios"
        element={<Navigate to="/insulinas" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}