// backend/src/types/Series.ts

export interface Series {
  id: number;          // Auto-increment ID
  itemId: number;      // 🔑 Link to the parent Item
  from: string;        // Starting number of the series (e.g., "00100")
  to: string;          // Ending number of the series (e.g., "00250")
  status: "available" | "used" | "partial";  
  createdAt: Date;     // When the series was added
  updatedAt: Date;     // Last update time
}
