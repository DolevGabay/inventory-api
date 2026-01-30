import db from "../db/database.js";
import { Product } from "../models/Product.js";

export function getAllProducts() {
  const query = db.prepare("SELECT * FROM products");

  const products = [];
  for (const row of query.iterate()) {
    products.push(Product.fromRow(row));
  }

  return products;
}

export function insertProduct(name) {
  db.prepare("INSERT INTO products (name) VALUES (?)").run(name);
}

export function updateProductName(oldName, newName) {
  const query = db.prepare("UPDATE products SET name = ? WHERE name = ?");
  const info = query.run(newName, oldName);
  return info.changes;
}

export function deleteProduct(name) {
  const stmt = db.prepare("DELETE FROM products WHERE name = ?");
  const info = stmt.run(name);
  return info.changes;
}