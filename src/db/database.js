import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("store.db");

const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
db.exec(schema);

db.pragma("foreign_keys = ON"); // Enable foreign key enforcement (required for ON DELETE / ON UPDATE CASCADE in SQLite)

export default db;