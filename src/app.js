import express from "express";

import healthRouter from "./routes/health.js";
import productRouter from "./routes/product.routes.js";
import inventoryRouter from "./routes/inventory.routes.js";

const app = express();

app.use(express.json());

app.use("/health", healthRouter);
app.use("/product", productRouter);
app.use("/inventory", inventoryRouter);

app.use((err, req, res, next) => {
  console.error(err);

  const status = err.status ?? 500;
  res.status(status).json({
    error: err.message ?? "Internal Server Error",
  });
});

export default app;
