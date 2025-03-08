import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import UserForm from "./pages/UserForm";

import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/auth/Login";
import TokenExpiredPage from "./components/TokenExpired";
import NoFields from "./components/NoFields";
import ThanksPage from "./components/Thanks";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/form" element={<UserForm />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />

          <Route path="/expired" element={<TokenExpiredPage />} />
          <Route path="/no-fields" element={<NoFields />} />
          <Route path="/thanks" element={<ThanksPage />} />

          {/* Redirect any unmatched routes */}
          <Route path="*" element={<Navigate to="/admin/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
