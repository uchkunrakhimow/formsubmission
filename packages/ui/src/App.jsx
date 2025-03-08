import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import TokenGenerator from "./pages/TokenGenerator";
import UserForm from "./pages/UserForm";

import Dashboard from "./pages/admin/Dashboard";
import Auth from "./pages/auth/Login";
import TokenExpiredPage from "./components/TokenExpired";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<TokenGenerator />} />
          <Route path="/form" element={<UserForm />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<Auth />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />

          <Route path="/expired" element={<TokenExpiredPage />} />

          {/* Redirect any unmatched routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
