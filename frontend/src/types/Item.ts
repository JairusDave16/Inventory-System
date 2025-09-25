// frontend/src/types/Item.ts
export interface Item {
  id: number;
  name: string;
  category?: string;
  stock: number;   // ✅ matches backend
  series?: string;
}

// ✅ Local form state type for frontend inputs
export interface ItemFormState {
  name: string;
  category?: string;
  quantity: number;   // ✅ only for form
  series?: string;
}
