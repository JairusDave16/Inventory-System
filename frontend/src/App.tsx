import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import ItemList from "./components/ItemList";
import RequestList from "./components/RequestList";
import NotFound from "./pages/NotFound";
import Login from "./components/Login";
import Register from "./components/Register";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData: any, token: string) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {isAuthenticated && <Navbar onLogout={handleLogout} user={user} />}
        <main className="p-6">
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated ? <Navigate to="/" /> : <Register onLogin={handleLogin} />
              }
            />
            <Route
              path="/"
              element={
                isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/items"
              element={
                isAuthenticated ? <ItemList /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/requests"
              element={
                isAuthenticated ? <RequestList /> : <Navigate to="/login" />
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
