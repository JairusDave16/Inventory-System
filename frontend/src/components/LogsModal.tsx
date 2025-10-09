// src/components/LogsModal.tsx
import React from "react";
import { Item } from "../types/Item";
import { Log } from "../types/Log";
import { Modal } from "./Modal";

interface Props {
  logs: Log[];
  item: Item;
  isLoading: boolean;
  onClose: () => void;
  
}

export const LogsModal = ({ logs, item, isLoading, onClose }: Props) => {
  return (
    <Modal title={`Logs for ${item.name}`} onClose={onClose} size="lg">
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : logs.length > 0 ? (
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.type}</td>
                  <td>{log.stock}</td>
                  <td>
                    {new Date(log.date).toLocaleDateString()}{" "}
                    {new Date(log.date).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted">No logs available for this item.</p>
      )}
      <div className="mt-3 d-flex justify-content-end">
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
};
