export interface Request {
    id: number;
    userId: number;
    itemId: number;
    quantity: number;
    status: "pending" | "approved" | "rejected";
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=Request.d.ts.map