import request from "supertest";
import app from "../src/app.js";
import db from "../src/db/database.js";

function seedProducts(names) {
  const stmt = db.prepare("INSERT INTO products (name) VALUES (?)");
  for (const n of names) stmt.run(n);
}

function seedInventory(items) {
  const stmt = db.prepare("INSERT INTO inventory (name, quantity) VALUES (?, ?)");
  for (const it of items) stmt.run(it.name, it.quantity);
}

beforeEach(() => {
  db.exec("DELETE FROM inventory;");
  db.exec("DELETE FROM products;");
  seedProducts(["milk", "bread", "water"]);
});

describe("/product", () => {
  test("GET /product/all returns Array<Product>", async () => {
    const res = await request(app).get("/product/all").expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    for (const product of res.body) {
      expect(product).toHaveProperty("name");
      expect(typeof product.name).toBe("string");
    }

    expect(res.body.map((product) => product.name).sort()).toEqual(["bread", "milk", "water"]);
  });

  test("PUT /product creates product and returns updated Array<Product>", async () => {
    const res = await request(app)
      .put("/product")
      .send({ name: "sugar" })
      .expect(200);

    expect(res.body.map((product) => product.name).sort()).toEqual([
      "bread",
      "milk",
      "sugar",
      "water",
    ]);
  });

  test('PUT /product duplicate name returns 400 with error "product name already exists"', async () => {
    const res = await request(app)
      .put("/product")
      .send({ name: "milk" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "product name already exists" });
  });


  test('PUT /product missing name returns 400 with error "invalid product, name is missing"', async () => {
    const res = await request(app).put("/product").send({}).expect(400);

    expect(res.body).toEqual({ error: "invalid product, name is missing" });
  });
});

describe("/inventory", () => {
  test("GET /inventory returns Array<Inventory>", async () => {
    seedInventory([{ name: "bread", quantity: 4 }]);

    const res = await request(app).get("/inventory").expect(200);
    expect(res.body).toEqual([{ name: "bread", quantity: 4 }]);
  });

  test("POST /inventory replaces inventory and returns the new Array<Inventory>", async () => {
    seedInventory([
      { name: "bread", quantity: 4 },
      { name: "water", quantity: 1 },
    ]);

    const res = await request(app)
      .post("/inventory")
      .send([{ name: "milk", quantity: 2 }])
      .expect(200);

    expect(res.body).toEqual([{ name: "milk", quantity: 2 }]);

    // verify replacement via GET
    const getRes = await request(app).get("/inventory").expect(200);
    expect(getRes.body).toEqual([{ name: "milk", quantity: 2 }]);
  });

  test(
    'POST /inventory item name missing from products list returns 400 with documented error',
    async () => {
      const res = await request(app)
        .post("/inventory")
        .send([{ name: "not-exists", quantity: 1 }])
        .expect(400);

      expect(res.body).toEqual({
        error: "Some of the inventory items are missing in the products list",
      });
    }
  );

  test(
    'POST /inventory invalid scheme returns 400 with documented error (missing "name" or "quantity")',
    async () => {
      const res = await request(app)
        .post("/inventory")
        .send([{ name: "milk" }]) // missing quantity
        .expect(400);

      expect(res.body).toEqual({
        error:
          'Some of the inventory items are missing attribute: "name" or "quantity"',
      });
    }
  );

  test("POST /inventory/reset returns [] and clears inventory", async () => {
    seedInventory([{ name: "bread", quantity: 4 }]);

    const res = await request(app).post("/inventory/reset").expect(200);
    expect(res.body).toEqual([]);

    const getRes = await request(app).get("/inventory").expect(200);
    expect(getRes.body).toEqual([]);
  });
});
