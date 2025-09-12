import { Request, Response } from "express";
export declare const getAllItems: (_req: Request, res: Response) => Promise<void>;
export declare const getItemById: (req: Request, res: Response) => Promise<void>;
export declare const getItemsByCategory: (req: Request, res: Response) => Promise<void>;
export declare const createItem: (req: Request, res: Response) => Promise<void>;
export declare const updateItem: (req: Request, res: Response) => Promise<void>;
export declare const deleteItem: (req: Request, res: Response) => Promise<void>;
export declare const depositItem: (req: Request, res: Response) => void;
export declare const withdrawItem: (req: Request, res: Response) => void;
//# sourceMappingURL=inventoryController.d.ts.map