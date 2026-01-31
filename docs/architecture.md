# Architecture & Design

## Overview
Brief description of the system and its purpose.

## Overall Structure
- Express application
- Route → Service → Repository layering
- SQLite database (better-sqlite3)
- Validation with Zod

## Functional Requirements Mapping
### Products
- GET /product/all
- PUT /product
- Validation & uniqueness handling

### Inventory
- GET /inventory
- POST /inventory (replace semantics)
- POST /inventory/reset
- Foreign key enforcement

## Key Design Decisions
- Synchronous DB access using better-sqlite3
- Database-level constraints over application checks
- Centralized error handling
- Schema validation with Zod (shape-only)

## Assumptions
- Single-process usage
- Low to moderate data size
- SQLite is sufficient for persistence
