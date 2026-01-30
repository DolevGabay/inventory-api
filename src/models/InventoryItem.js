import { z } from "zod";

export const InventoryItemSchema = z
  .object({
    name: z.string({
      required_error: "invalid inventory item, name is missing",
    }).min(1, "invalid inventory item, name is missing"),

    quantity: z.number({
      required_error: "invalid inventory item, quantity is missing",
      invalid_type_error: "invalid inventory item, quantity must be a number",
    }).int("invalid inventory item, quantity must be an integer")
      .nonnegative("invalid inventory item, quantity must be >= 0"),
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
