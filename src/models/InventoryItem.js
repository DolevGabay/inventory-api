import { z } from "zod";

export const InventoryItemSchema = z
  .object({
    name: z.string(),
    quantity: z.number(),
  })
  .strict();

export class InventoryItem {
  constructor(name, quantity) {
    this.name = name;
    this.quantity = quantity;
  }

  static fromRow(row) {
    return new InventoryItem(row.name, row.quantity);
  }
}
