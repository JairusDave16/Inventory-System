import { Item } from "../models/Item";
import { Log } from "../models/Log";
export declare let items: Item[];
export declare let logs: Log[];
export declare function nextItemId(): number;
export declare function addLog(itemId: number, type: "deposit" | "withdraw" | "update", quantity: number, notes?: string): void;
//# sourceMappingURL=item.d.ts.map