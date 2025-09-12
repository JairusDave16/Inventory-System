export interface InventoryItem {
    id: number;
    name: string;
    category: string;
    quantity: number;
    series?: string;
}
export type NewInventoryItem = Omit<InventoryItem, "id">;
export type UpdateInventoryItem = Partial<Omit<InventoryItem, "id">>;
//# sourceMappingURL=inventory.d.ts.map