import { Request, Response } from "express";
export declare const logController: {
    getLogsByItem(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
    addLog(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
    getAllLogs(req: Request, res: Response): void;
};
//# sourceMappingURL=logController.d.ts.map