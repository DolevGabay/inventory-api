## AI Tools Used
The following prompts were provided to ChatGPT during development to assist with design decisions, validation strategies, database usage, and testing.

### Prompt List
- does SQLite support ON UPDATE CASCADE and ON DELETE CASCADE when defining foreign keys in table creation? Please provide examples

- is there a js library for schema validation and model serialization similar to Pydantic in Python?

- explain Zod in detail, including its main features, advantages, and provide example usage.

- have a look at Product and InventoryItem classes, help me design validation schemas for them and show examples of how to use them.

```javascript
export class Product {
  constructor(name) {
    this.name = name;
  }

  static fromRow(row) {
    return new Product(row.name);
  }
}

export class InventoryItem {
  constructor(name, quantity) {
    this.name = name;
    this.quantity = quantity;
  }

  static fromRow(row) {
    return new InventoryItem(row.name, row.quantity);
  }
}
```

- currently when creating a new product, i first check if it exists and then insert it. this results in two database operations. can SQLite support inserting directly and handling duplicate primary key errors instead? Please provide examples and links to the official documentation.

- what tools are available in JavaScript for writing unit and integration tests for backend applications?

- explain Jest, including its main concepts and provide example tests.

- given the following express inventory routes, provide examples of how to write unit tests for them using Jest.

```javascript
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

```