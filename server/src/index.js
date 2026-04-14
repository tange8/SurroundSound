import "dotenv/config";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "SurroundSound server is running 🎵" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});