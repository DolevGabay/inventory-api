import { Router } from "express";
import * as inventoryService from "../services/inventory.service.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(inventoryService.getInventory());
});

router.post("/", (req, res) => {
  const inventory = inventoryService.createInventoryItems(req.body);
  res.json(inventory);
});

router.post("/reset", (req, res) => {
  res.json(inventoryService.resetInventory());
});

export default router;
