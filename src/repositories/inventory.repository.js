import db from "../db/database.js";
import { InventoryItem } from "../models/InventoryItem.js";

export function getInventoryItems() {
  const query = db.prepare("SELECT * FROM inventory");

  const inventoryItems = [];
  for (const row of query.iterate()) {
    inventoryItems.push(InventoryItem.fromRow(row));
  }

  return inventoryItems;
}

export function insertInventoryItems(items) {
  const query = db.prepare("INSERT INTO inventory (name, quantity) VALUES (?, ?)");

  for (const item of items) {
    query.run(item.name, item.quantity);
  }
}

export function deleteInventoryItems() {
  db.prepare("DELETE FROM inventory").run();
}