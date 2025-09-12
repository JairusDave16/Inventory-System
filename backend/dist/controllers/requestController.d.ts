import { Request as ExpressRequest, Response } from "express";
export declare const getAllRequests: (_req: ExpressRequest, res: Response) => void;
export declare const createRequest: (req: ExpressRequest, res: Response) => void;
export declare const getRequestById: (req: ExpressRequest, res: Response) => Response<any, Record<string, any>> | undefined;
export declare const deleteRequest: (req: ExpressRequest, res: Response) => void;
export declare const approveRequest: (req: ExpressRequest, res: Response) => Response<any, Record<string, any>> | undefined;
export declare const rejectRequest: (req: ExpressRequest, res: Response) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=requestController.d.ts.map