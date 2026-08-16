import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Unauthorized from "./pages/Unauthorized";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import Stores from "./pages/stores/Stores";
import Account from "./pages/account/Account";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* ==================== PUBLIC ROUTES ==================== */}

          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/unauthorized"
            element={<Unauthorized />}
          />


          {/* ==================== AUTHENTICATED ROUTES ==================== */}

          <Route element={<ProtectedRoute />}>

            {/* Account - accessible to ALL logged-in users */}
            <Route
              path="/account"
              element={<Account />}
            />

            {/* Stores - accessible to ALL logged-in users */}
            <Route
              path="/stores"
              element={<Stores />}
            />


            {/* ==================== ADMIN ==================== */}

            <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
              <Route
                path="/admin"
                element={<AdminDashboard />}
              />
            </Route>


            {/* ==================== USER ==================== */}

            <Route element={<RoleRoute allowedRoles={["USER"]} />}>
              <Route
                path="/user"
                element={<UserDashboard />}
              />
            </Route>


            {/* ==================== STORE OWNER ==================== */}

            <Route element={<RoleRoute allowedRoles={["STORE_OWNER"]} />}>
              <Route
                path="/owner"
                element={<OwnerDashboard />}
              />
            </Route>

          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;