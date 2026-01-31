# Inventory API

A simple REST API built with Node.js for managing products and inventory for a store.

---

## Installation

### Prerequisites
- Node.js
- npm

### Install dependencies
```bash
npm install
```

### Start the server
```bash
npm start
```

The server will start on: http://localhost:3000

### Run in development mode (with auto-reload)
```bash
npm run dev
```

### Running tests
```bash
npm test
```

---

## Tech Stack

- **Node.js** - runtime
- **Express** - HTTP server & routing
- **SQLite** - embedded database
- **better-sqlite3** – synchronous SQLite driver
- **Zod** - request validation
- **Jest + Supertest** - API testing

---

## Design & Architecture

See [docs/architecture.md](docs/architecture.md) for design decisions and system structure.

## Chat GPT Prompts

See [docs/prompts.md](docs/prompts.md).