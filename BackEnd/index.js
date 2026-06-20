const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "apartemen_mahatatanjungbarat_db",
});

db.connect((err) => {
  if (err) {
    console.log("Database gagal terhubung:", err);
  } else {
    console.log("Database berhasil terhubung");
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "Selamat datang di API AparHouse",
  });
});

app.post("/booking", (req, res) => {
  const { nama, nomor_hp, email, tanggal, tipe_unit } = req.body;

  if (!nama || !nomor_hp || !email || !tanggal || !tipe_unit) {
    return res.status(400).json({
      message: "Data booking belum lengkap",
    });
  }

  const sql = `
    INSERT INTO bookings (nama, nomor_hp, email, tanggal_kunjungan, tipe_unit)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [nama, nomor_hp, email, tanggal, tipe_unit], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Booking gagal disimpan",
        error: err.message,
      });
    }

    res.status(201).json({
      message: "Booking berhasil dikirim",
      id: result.insertId,
    });
  });
});

app.get("/booking", (req, res) => {
  const sql = "SELECT * FROM bookings ORDER BY created_at DESC";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal mengambil data booking",
        error: err.message,
      });
    }

    res.json(result);
  });
});

app.delete("/booking/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM bookings WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Booking gagal dihapus",
        error: err.message,
      });
    }

    res.json({
      message: "Booking berhasil dihapus",
    });
  });
});

app.put("/booking/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql = "UPDATE bookings SET status = ? WHERE id = ?";

  db.query(sql, [status, id], (err) => {
    if (err) {
      return res.status(500).json({
        message: "Status gagal diubah",
        error: err.message,
      });
    }

    res.json({
      message: "Status booking berhasil diubah",
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});