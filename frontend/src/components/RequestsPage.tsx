// frontend/src/components/RequestsPage.tsx
import React, { useEffect, useState } from "react";
import { getRequests, approveRequest, rejectRequest } from "../api/request";
import { Request } from "../types/request";

const RequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch requests
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await getRequests();
      setRequests(data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle approve
  const handleApprove = async (id: number) => {
    try {
      await approveRequest(id);
      fetchRequests(); // refresh
    } catch (err) {
      console.error("Error approving request:", err);
    }
  };

  // Handle reject
  const handleReject = async (id: number) => {
    try {
      await rejectRequest(id);
      fetchRequests(); // refresh
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h1>📑 Requests</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{req.userId}</td>
                <td>{req.itemId}</td>
                <td>{req.quantity}</td>
                <td>{req.status}</td>
                <td>
                  {req.status === "pending" && (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleApprove(req.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleReject(req.id)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RequestsPage;
