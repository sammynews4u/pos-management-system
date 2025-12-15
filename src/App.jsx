import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import All Components
import Landing from "./components/Landing";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import POS from "./components/POS";
import SalesHistory from "./components/SalesHistory";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  // CHECK AUTH ON REFRESH
  // This ensures the user stays logged in if they refresh the browser
  async function isAuth() {
    try {
      const response = await fetch("https://pos-server-km8a.onrender.com/auth/is-verify", {
        method: "GET",
        headers: { token: localStorage.getItem("token") }
      });

      const parseRes = await response.json();

      // If backend says "true", keep user logged in
      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    isAuth();
  }, []);

  return (
    <Router>
      <div className="container-fluid p-0">
        <Routes>
          
          {/* 1. LANDING PAGE (Public) */}
          {/* If logged in, go to Dashboard. If not, show Landing Page. */}
          <Route 
            path="/" 
            element={!isAuthenticated ? <Landing /> : <Navigate to="/dashboard" />} 
          />

          {/* 2. LOGIN ROUTE */}
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login setAuth={setAuth} /> : <Navigate to="/dashboard" />} 
          />
          
          {/* 3. REGISTER ROUTE */}
          <Route 
            path="/register" 
            element={!isAuthenticated ? <Register setAuth={setAuth} /> : <Navigate to="/dashboard" />} 
          />
          
          {/* 4. DASHBOARD (Protected) */}
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard setAuth={setAuth} /> : <Navigate to="/login" />} 
          />

          {/* 5. POS SYSTEM (Protected) */}
          <Route 
            path="/pos" 
            element={isAuthenticated ? <POS /> : <Navigate to="/login" />} 
          />

          {/* 6. SALES HISTORY (Protected) */}
          <Route 
             path="/sales-history" 
             element={isAuthenticated ? <SalesHistory /> : <Navigate to="/login" />} 
          />

          {/* 7. CATCH ALL (Redirect to Home) */}
           <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;