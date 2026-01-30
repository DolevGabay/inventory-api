import app from "./app.js";
import "./db/database.js"; // ensure DB is initialized

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
