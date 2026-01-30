import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string({
    required_error: "invalid product, name is missing",
  }).min(1, "invalid product, name is missing"),
}).strict();

export class Product {
  constructor(name) {
    this.name = name;
  }

  static fromRow(row) {
    return new Product(row.name);
  }
}
