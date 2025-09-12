import { Item } from "../types/Item";
import { Log } from "../types/Log";
export declare function getItems(): Item[];
export declare function addItem(item: Item): Item;
export declare function depositItem(itemId: number, quantity: number, notes?: string): Item | null;
export declare function withdrawItem(itemId: number, quantity: number, notes?: string): Item | null;
export declare function updateItemStock(itemId: number, newStock: number, notes?: string): Item | null;
export declare function getLogs(): Log[];
//# sourceMappingURL=itemService.d.ts.map