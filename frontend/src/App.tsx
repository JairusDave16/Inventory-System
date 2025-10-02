// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import ItemList from "./components/ItemList";
import RequestList from "./components/RequestList";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-blue-600 text-white shadow-md">
          <div className="container mx-auto flex items-center justify-between px-4 py-3">
            <NavLink className="text-lg font-bold flex items-center gap-2" to="/">
              📦 <span>InventoryApp</span>
            </NavLink>
            <ul className="flex gap-6">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `hover:underline ${isActive ? "font-semibold underline" : ""}`
                  }
                >
                  Items
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/requests"
                  className={({ isActive }) =>
                    `hover:underline ${isActive ? "font-semibold underline" : ""}`
                  }
                >
                  Requests
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<ItemList />} />
              <Route path="/requests" element={<RequestList />} />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-100 border-t text-center py-4">
          <small className="text-gray-600">© 2025 InventoryApp</small>
        </footer>
      </div>
    </Router>
  );
}

export default App;
