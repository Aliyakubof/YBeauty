const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Firebase service key

const app = express();
const PORT = process.env.PORT || 3000;

// Firebase admin init
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ybeauty-f45b6-default-rtdb.firebaseio.com"
});

const db = admin.database();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // public papka ichidagi HTML, CSS, JS fayllar uchun

// GET: barcha buyurtmalar (admin panel)
app.get("/api/orders", async (req, res) => {
  try {
    const snapshot = await db.ref("orders").once("value");
    res.json(snapshot.val() || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: buyurtmani yangilash (sotildi status)
app.post("/api/orders/:id", async (req, res) => {
  const id = req.params.id;
  const { sotildi } = req.body;
  try {
    const orderRef = db.ref(`orders/${id}`);
    const snap = await orderRef.once("value");
    const data = snap.val();
    if (!data) return res.status(404).json({ error: "Buyurtma topilmadi" });
    await orderRef.update({ ...data, sotildi });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: buyurtmani o‘chirish
app.delete("/api/orders/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await db.ref(`orders/${id}`).remove();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serverni ishga tushurish
app.listen(PORT, () => {
  console.log(`Server ishlayapti: http://localhost:${PORT}`);
});
