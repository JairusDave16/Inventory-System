import { Log } from "../types/Log";
export declare const logService: {
    getAllLogs(): Log[];
    getLogsByItem(itemId: number): Log[];
    addLog(itemId: number, type: "deposit" | "withdraw" | "update", quantity: number): Log;
};
//# sourceMappingURL=logService.d.ts.map