const express = require("express");
const cors = require('cors');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const port = 4754;

const { Pool } = require("pg");
const pool = new Pool({
  user: "user_4754",
  host: "postgres",
  database: "crm_4754",
  password: "pass_4754",
  port: 5432,
});

// サーバ起動
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

// 顧客一覧取得API
app.get("/customers", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers");
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
});

// 顧客追加API
app.post("/add-customer", async (req, res) => {
  try {
    const { companyName, industry, contact, location } = req.body;
    const newCustomer = await pool.query(
      "INSERT INTO customers (company_name, industry, contact, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [companyName, industry, contact, location]
    );
    res.json({ success: true, customer: newCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// 顧客詳細取得API
app.get("/customers/:id", async (req, res) => {
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

// 顧客詳細取得API
app.get("/customers/:id", async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM customers WHERE customer_id = $1", [id]);
  res.json(result.rows[0]);
});

// 顧客削除API
app.delete("/customers/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM customers WHERE customer_id = $1", [id]);
  res.json({ success: true });
});

// 顧客更新API
app.put("/customers/:id", async (req, res) => {
  const { id } = req.params;
  const { company_name, industry, contact, location } = req.body;
  await pool.query(
    "UPDATE customers SET company_name=$1, industry=$2, contact=$3, location=$4, updated_date=NOW() WHERE customer_id=$5",
    [company_name, industry, contact, location, id]
  );
  res.json({ success: true });
});
