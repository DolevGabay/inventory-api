import * as productRepo from "../repositories/product.repository.js";
import { ProductSchema } from "../models/Product.js";

export function getProducts() {
  return productRepo.getAllProducts();
}

export function createProduct(product) {
  const result = ProductSchema.safeParse(product);

  if (!result.success) {
    const err = new Error(
      'Some of the inventory items are missing attribute: "name" or "quantity"'
    );
    err.status = 400;
    throw err;
  }

  try {
    productRepo.insertProduct(product.name);
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_PRIMARYKEY" || error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      throw new Error("product name already exists");
    }
    throw error;
  }

  return productRepo.getAllProducts();
}

export function updateProduct(oldName, newName) {
  if (!oldName || !newName) {
    const e = new Error("invalid update, oldName and newName are required");
    e.status = 400;
    throw e;
  }

  try {
    const changes = productRepo.updateProductName(oldName, newName);

    if (changes === 0) {
      const e = new Error("product not found");
      e.status = 404;
      throw e;
    }
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_PRIMARYKEY" || err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      const e = new Error("product name already exists");
      e.status = 409;
      throw e;
    }
    throw err;
  }

  return productRepo.getAllProducts();
}

export function deleteProduct(name) {
  if (!name) {
    const e = new Error("invalid delete, name is required");
    e.status = 400;
    throw e;
  }

  try {
    const changes = productRepo.deleteProduct(name);

    if (changes === 0) {
      const e = new Error("product not found");
      e.status = 404;
      throw e;
    }
  } catch (err) {
    // If inventory has FK referencing products, deleting a product used in inventory will fail
    if (err.code === "SQLITE_CONSTRAINT_FOREIGNKEY" || err.code === "SQLITE_CONSTRAINT") {
      const e = new Error("cannot delete product that exists in inventory");
      e.status = 409;
      throw e;
    }
    throw err;
  }

  return productRepo.getAllProducts();
}