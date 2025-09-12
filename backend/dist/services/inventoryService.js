"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const logService_1 = require("./logService");
let items = [];
let nextId = 1;
exports.InventoryService = {
    getAll() {
        return items;
    },
    getById(id) {
        return items.find((item) => item.id === id);
    },
    create(data) {
        const newItem = { id: nextId++, ...data };
        items.push(newItem);
        // Log creation as a "deposit"
        logService_1.logService.addLog(newItem.id, "deposit", data.quantity);
        return newItem;
    },
    deposit(id, amount) {
        const item = this.getById(id);
        if (!item)
            throw new Error("Item not found");
        item.quantity += amount;
        logService_1.logService.addLog(item.id, "deposit", amount);
        return item;
    },
    withdraw(id, amount) {
        const item = this.getById(id);
        if (!item)
            throw new Error("Item not found");
        if (item.quantity < amount)
            throw new Error("Insufficient stock");
        item.quantity -= amount;
        logService_1.logService.addLog(item.id, "withdraw", amount);
        return item;
    },
    getByCategory(category) {
        return items.filter(item => item.category === category);
    },
    update(id, data) {
        const item = this.getById(id);
        if (!item)
            return null;
        Object.assign(item, data);
        if (data.quantity !== undefined) {
            logService_1.logService.addLog(item.id, "update", data.quantity);
        }
        return item;
    },
    delete(id) {
        const index = items.findIndex(i => i.id === id);
        if (index === -1)
            return null;
        const [deleted] = items.splice(index, 1);
        return deleted;
    }
};
//# sourceMappingURL=inventoryService.js.map