# Architecture & Design

## Overview
This project is a simple REST API built with Node.js for managing products and inventory in a store.
The focus of the design is correctness, clarity, and maintainability while keeping the solution lightweight.

The system exposes endpoints for managing a list of products and a corresponding inventory, ensuring data consistency through database-level constraints and clear separation of responsibilities in the application code.

---

## Overall Structure

### Database
- **SQLite (better-sqlite3)**
  - Chosen for its simplicity, reliability, and zero configuration setup.
  - Well suited for small to medium scale projects where a full database server is unnecessary.
  - Supports transactions and foreign key constraints, which are critical for maintaining inventory consistency.
  - `better-sqlite3` provides synchronous access, simplifying control flow and error handling.

### Web Server
- **Express**
  - Lightweight, widely adopted, and well maintained framework for building REST APIs.
  - Easy to extend and reason about for small services.

### Layered Architecture
The application follows a **Route → Service → Repository** structure:

- **Routes**
  - Handle HTTP specific concerns (paths, methods, request/response objects).
  - Delegate all business logic to services.

- **Services**
  - Contain business logic and application rules.
  - Orchestrate repository calls and manage transactions.
  - Translate low level errors into meaningful API errors.

- **Repositories**
  - Encapsulate all database access.
  - Responsible for executing SQL statements and returning domain data.
  - Keep database logic isolated and reusable.

This separation improves maintainability, testability, and clarity, while allowing transactional control at the service layer.

### Validation
- **Zod**
  - Used to validate request payloads and ensure correct data shape.
  - Prevents invalid data from reaching business logic or the database.

### Models & Serialization
- Domain models (`Product`, `InventoryItem`) are used to represent database rows as explicit objects.
- This provides:
  - Clear contracts between layers
  - Easier refactoring
  - Better readability compared to working with raw database rows

---

## Functional Requirements Mapping

### Data Persistence
- SQLite is used to persist products and inventory data.
- The database schema enforces correctness through primary keys and foreign key constraints.

### Products
- Products are stored in a `products` table.
- Each product is identified uniquely by its `name`, which acts as the primary key.

#### API
- **GET `/product/all`**
  - Returns the full list of products.
- **PUT `/product`**
  - Adds a new product.
  - Enforces uniqueness at the database level.

### Inventory
- Inventory items are stored in an `inventory` table.
- Each inventory item:
  - Uses `name` as a primary key
  - References `products(name)` as a foreign key
  - Ensures inventory items can only exist for valid products

#### Referential Integrity
- Foreign key constraints with `ON UPDATE CASCADE` and `ON DELETE CASCADE` are used.
- This guarantees inventory remains consistent when products are renamed or deleted.

#### API
- **GET `/inventory`**
  - Returns the current inventory state.
- **POST `/inventory`**
  - Replaces the entire inventory with the provided list.
  - Ensures all items reference existing products.
- **POST `/inventory/reset`**
  - Clears all inventory items and returns an empty array.

---

## Key Design Decisions

- **Synchronous database access**
  - Simplifies control flow and avoids unnecessary async complexity.
  - Suitable for the expected scale of the application.

- **Database-level constraints over application checks**
  - Primary keys and foreign keys enforce correctness reliably.
  - Cascading updates and deletes keep inventory automatically in sync.

- **Layered architecture**
  - Clear separation of responsibilities.
  - Easier testing and future extension.
  - Services manage transactions and business rules.

---

## Assumptions

- The application is intended for low to moderate data volumes.
- SQLite provides sufficient persistence and performance for the use case.
- Based on my reasonable assumptions from the task description:
  - `POST /inventory` was implemented to replace the entire inventory rather than append items.
  - Product update and delete operations were included to provide full product lifecycle management, despite not being explicitly specified in the API documentation.
- The service is assumed to run as a single process (no concurrent writers across multiple instances).
