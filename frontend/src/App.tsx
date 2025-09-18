// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import ItemList from "./components/ItemList";
import RequestsPage from "./components/RequestsPage";

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
          <div className="container">
            <NavLink className="navbar-brand fw-bold" to="/">
              📦 InventoryApp
            </NavLink>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active fw-semibold" : "")
                    }
                  >
                    Items
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/requests"
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active fw-semibold" : "")
                    }
                  >
                    Requests
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-grow-1">
          <div className="container py-4">
            <Routes>
              <Route path="/" element={<ItemList />} />
              <Route path="/requests" element={<RequestsPage />} />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-light text-center py-3 mt-auto border-top">
          <small className="text-muted">© 2025 InventoryApp</small>
        </footer>
      </div>
    </Router>
  );
}

export default App;
