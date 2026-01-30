import { Router } from "express";
import * as productService from "../services/product.service.js";

const router = Router();

router.get("/all", (req, res) => {
  res.json(productService.getProducts());
});

router.put("/", (req, res) => {
  const products = productService.createProduct(req.body);
  res.json(products);
});

router.patch("/", (req, res) => {
  const { oldName, newName } = req.body;
  const products = productService.updateProduct(oldName, newName);
  res.json(products);
});

router.delete("/", (req, res) => {
  const name = req.query.name;
  const products = productService.deleteProduct(name);
  res.json(products);
});

export default router;