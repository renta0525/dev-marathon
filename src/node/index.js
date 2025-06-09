const express = require("express");
const cors = require('cors');
const { Pool } = require("pg");

const app = express();
const port = 4754;

// ミドルウェア
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// DB接続
const pool = new Pool({
  user: "user_renta_ueno",            // ✅ 修正
  host: "localhost",
  database: "db_renta_ueno",          // ✅ 修正
  password: "5Rw5YDaWc5jc",           // ✅ 修正
  port: 5432,
});

// 🔽 API用のRouterを作成
const router = express.Router();

// 顧客一覧取得API
router.get("/customers", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers");
    res.json(customerData.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB Error" });
  }
});

// 顧客追加API
router.post("/add-customer", async (req, res) => {
  try {
    const { companyName, industry, contact, location } = req.body;
    const newCustomer = await pool.query(
      "INSERT INTO customers (company_name, industry, contact, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [companyName, industry, contact, location]
    );
    res.json({ success: true, customer: newCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// 顧客詳細取得API
router.get("/customers/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM customers WHERE customer_id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Customer not found" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 顧客削除API
router.delete("/customers/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM customers WHERE customer_id = $1", [id]);
  res.json({ success: true });
});

// 顧客更新API
router.put("/customers/:id", async (req, res) => {
  const { id } = req.params;
  const { company_name, industry, contact, location } = req.body;
  await pool.query(
    "UPDATE customers SET company_name=$1, industry=$2, contact=$3, location=$4, updated_date=NOW() WHERE customer_id=$5",
    [company_name, industry, contact, location, id]
  );
  res.json({ success: true });
});

// 🔽 ここで /api_renta_ueno にマウントする
app.use("/api_renta_ueno", router);

// サーバ起動
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
