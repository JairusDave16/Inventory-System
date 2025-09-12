export type ID = number;
/** Shape required when creating a new item (no id yet) */
export interface InventoryCreate {
    name: string;
    category: string;
    quantity: number;
    /** optional; with exactOptionalPropertyTypes, include | undefined if you plan to pass it explicitly */
    series?: string | undefined;
}
/** Stored item (has id) */
export interface InventoryItem extends InventoryCreate {
    id: ID;
}
/** Partial update (id never updatable) */
export type InventoryUpdate = Partial<InventoryCreate>;
//# sourceMappingURL=inventoryItem.d.ts.map