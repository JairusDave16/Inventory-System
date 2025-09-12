import { InventoryItem, NewInventoryItem } from "../types/inventory";
export declare const InventoryService: {
    getAll(): InventoryItem[];
    getById(id: number): InventoryItem | undefined;
    create(data: NewInventoryItem): InventoryItem;
    deposit(id: number, amount: number): InventoryItem;
    withdraw(id: number, amount: number): InventoryItem;
    getByCategory(category: string): InventoryItem[];
    update(id: number, data: Partial<NewInventoryItem>): InventoryItem | null;
    delete(id: number): InventoryItem | null | undefined;
};
//# sourceMappingURL=inventoryService.d.ts.map