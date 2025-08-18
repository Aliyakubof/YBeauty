require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 3000;

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  }),
  databaseURL: process.env.DATABASE_URL
});

const db = admin.database();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// API: barcha buyurtmalar
app.get("/api/orders", async (req, res) => {
  try {
    const snapshot = await db.ref("orders").once("value");
    res.json(snapshot.val() || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: buyurtmani yangilash
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

// API: buyurtmani o‘chirish
app.delete("/api/orders/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await db.ref(`orders/${id}`).remove();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server ishlayapti: http://localhost:${PORT}`);
});
