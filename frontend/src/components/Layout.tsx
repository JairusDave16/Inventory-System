// frontend/src/components/Layout.tsx
import React from "react";
import { Link } from "react-router-dom";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className="bg-dark text-white p-3 vh-100"
        style={{ width: "220px", position: "fixed" }}
      >
        <h4 className="mb-4">📦 Inventory</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/" className="nav-link text-white">
              🏠 Dashboard
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/items" className="nav-link text-white">
              📋 Items
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/requests" className="nav-link text-white">
              📑 Requests
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/approvals" className="nav-link text-white">
              ✅ Approvals
            </Link>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-grow-1" style={{ marginLeft: "220px" }}>
        {/* Top Navbar */}
        <nav className="navbar navbar-light bg-light shadow-sm px-4">
          <span className="navbar-brand mb-0 h5">Inventory System</span>
        </nav>

        {/* Page Content */}
        <main className="p-4 bg-light" style={{ minHeight: "100vh" }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
