import React from "react";

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">
        Welcome to the Inventory System
      </h1>
      <p className="text-gray-600">
        Use the navigation above to manage your items and requests.
      </p>
    </div>
  );
}
