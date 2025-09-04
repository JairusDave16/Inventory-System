// src/components/LogsModal.tsx
import React from "react";
import { Item } from "../types/Item";
import { Log } from "../types/Log";
import { Modal } from "./Modal";

interface Props {
  logs: Log[];
  item: Item;
  onClose: () => void;
}

export const LogsModal = ({ logs, item, onClose }: Props) => {
  return (
    <Modal title={`Logs for ${item.name}`} onClose={onClose} size="lg">
      {logs.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.type}</td>
                <td>{log.amount}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No logs found.</p>
      )}
      <div className="mt-3 d-flex justify-content-end">
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
};
