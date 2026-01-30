import db from "../db/database.js";
import * as inventoryRepo from "../repositories/inventory.repository.js";
import { InventoryItem, InventoryItemSchema } from "../models/InventoryItem.js";

export function getInventory() {
  return inventoryRepo.getInventoryItems();
}

export function createInventoryItems(items) {
  if (!Array.isArray(items)) {
    const err = new Error(
      'Some of the inventory items are missing attribute: "name" or "quantity"'
    );
    err.status = 400;
    throw err;
  }

  const inventoryItems = [];
  for (const item of items) {
    const result = InventoryItemSchema.safeParse(item);

    if (!result.success) {
      const err = new Error(
        'Some of the inventory items are missing attribute: "name" or "quantity"'
      );
      err.status = 400;
      throw err;
    }

    inventoryItems.push(
      new InventoryItem(result.data.name, result.data.quantity)
    );
  }

  try {
    return db.transaction(() => {
      inventoryRepo.deleteInventoryItems();
      inventoryRepo.insertInventoryItems(inventoryItems);
      return inventoryRepo.getInventoryItems();
    })();
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_FOREIGNKEY" || error.code === "SQLITE_CONSTRAINT") {
      const e = new Error(
        "Some of the inventory items are missing in the products list"
      );
      e.status = 400;
      throw e;
    }

    if (error.code === "SQLITE_CONSTRAINT_PRIMARYKEY" || error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      const e = new Error("Duplicate item name in inventory payload");
      e.status = 400;
      throw e;
    }

    throw error;
  }
}

export function resetInventory() {
  return db.transaction(() => {
    inventoryRepo.deleteInventoryItems();
    return [];
  })();
}
