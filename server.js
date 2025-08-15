// server.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB ulanish
const MONGO_URI = "mongodb+srv://Muxammadali:aass2617@cluster0.pqow7zd.mongodb.net/sotuv?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB ulanish muvaffaqiyatli"))
    .catch(err => console.error("❌ MongoDB ulanish xatosi:", err));

// Admin kaliti
const ADMIN_KEY = "12345";

// Mongoose schema
const orderSchema = new mongoose.Schema({
    sana: String,
    ism: String,
    tel: String,
    manzil: String,
    mahsulot: String,
    narx: Number
});
const Order = mongoose.model("Order", orderSchema);

app.use(cors());
app.use(bodyParser.json());

// Public papkani ochish
app.use(express.static(path.join(__dirname, "public")));

// Asosiy sahifa
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "sotuv.html"));
});

// Buyurtma qabul qilish
app.post("/api/orders", async (req, res) => {
    const order = req.body;
    if (!order.ism || !order.tel || !order.manzil || !order.mahsulot || !order.narx) {
        return res.status(400).json({ success: false, message: "Barcha maydonlarni to‘ldiring" });
    }
    try {
        await Order.create(order);
        console.log("✅ Yangi buyurtma:", order);
        res.json({ success: true });
    } catch (err) {
        console.error("❌ Buyurtma saqlashda xato:", err);
        res.status(500).json({ success: false, message: "Server xatosi" });
    }
});

// Admin buyurtmalarni ko‘rish
app.get("/api/orders", async (req, res) => {
    const key = req.query.key;
    if (key !== ADMIN_KEY) {
        return res.status(403).json({ success: false, message: "Ruxsat yo‘q" });
    }
    try {
        const orders = await Order.find().sort({ _id: -1 });
        res.json(orders);
    } catch (err) {
        console.error("❌ Buyurtmalarni olishda xato:", err);
        res.status(500).json({ success: false, message: "Server xatosi" });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server ${PORT}-portda ishlayapti`);
});
