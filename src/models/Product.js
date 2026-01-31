import { z } from "zod";

export const ProductSchema = z
  .object({
    name: z.string(),
  })
  .strict();

export class Product {
  constructor(name) {
    this.name = name;
  }

  static fromRow(row) {
    return new Product(row.name);
  }
}
