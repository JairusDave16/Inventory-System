// frontend/src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import ItemList from "./components/ItemList";
import RequestsPage from "./components/RequestsPage";

function App() {
  return (
    <Router>
      <div className="App">
        {/* ✅ Simple navigation */}
        <nav style={{ marginBottom: "1rem" }}>
          <Link to="/" style={{ marginRight: "1rem" }}>Items</Link>
          <Link to="/requests">Requests</Link>
        </nav>

        {/* ✅ Define routes */}
        <Routes>
          <Route path="/" element={<ItemList />} />
          <Route path="/requests" element={<RequestsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
