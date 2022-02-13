import { AuthProvider } from "../context/AuthContext";
import Signup from "./authentication/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./authentication/Profile";
import Login from "./authentication/Login";
import RequiredAuth from "./authentication/RequiredAuth";
import ForgotPassword from "./authentication/ForgotPassword";
import UpdateProfile from "./authentication/UpdateProfile";
import Dashboard from "./google-drive/Dashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* drive  */}
          <Route
            exact
            path="/"
            element={
              <RequiredAuth>
                <Dashboard />
              </RequiredAuth>
            }
          />
          <Route
            exact
            path="/folder/:folderId"
            element={
              <RequiredAuth>
                <Dashboard />
              </RequiredAuth>
            }
          />

          {/* profile */}
          <Route
            path="/user"
            element={
              <RequiredAuth>
                <Profile />
              </RequiredAuth>
            }
          />
          <Route
            path="/update-profile"
            element={
              <RequiredAuth>
                <UpdateProfile />
              </RequiredAuth>
            }
          />

          {/* auth */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
