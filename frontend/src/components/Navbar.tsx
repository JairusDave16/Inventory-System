import React from "react";
import { NavLink } from "react-router-dom";

interface NavbarProps {
  onLogout: () => void;
  user: any;
}

export default function Navbar({ onLogout, user }: NavbarProps) {
  return (
    <nav className="bg-blue-600 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold">Inventory System</h1>
        <div className="flex items-center space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "font-semibold underline" : "hover:underline"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/items"
            className={({ isActive }) =>
              isActive ? "font-semibold underline" : "hover:underline"
            }
          >
            Items
          </NavLink>
          <NavLink
            to="/requests"
            className={({ isActive }) =>
              isActive ? "font-semibold underline" : "hover:underline"
            }
          >
            Requests
          </NavLink>
          <span className="text-sm">Welcome, {user?.name}</span>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
