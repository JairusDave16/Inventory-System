// backend/src/models/Item.ts
import { Series } from "./Series";

export interface Item {
  id: number;
  name: string;
  unit: string;
  category: string;
  description?: string;
  stock: number;     // auto-calculated
  series: Series[];  // list of ranges
}
