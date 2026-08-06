const express = require("express");
const cors = require("cors");
const db = require("./db");

const productRoutes = require("./routes/product.routes");

const app = express();
const PORT = process.env.PORT || 6000;

app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_URL || "https://rozana-projects.online",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

db.connect()
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB error:", err));

/* ROUTES */
app.use("/products", productRoutes);

/* HEALTH CHECK */
app.get("/health", (req, res) => {
res.status(200).json({ status: "ok" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Product Service running on port ${PORT}`);
});
