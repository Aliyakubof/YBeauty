const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));  // public papkada fayllar bor

// Bosh sahifa
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sotuv.html'));
});

// 404
app.use((req, res) => {
  res.status(404).send('404 - Page Not Found');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

const app = express();
const PORT = process.env.PORT || 3000;

// JSON body o‘qish
app.use(bodyParser.json());
app.use(express.static("public"));

// Firebase ulash
const serviceAccount = require("./serviceAccountKey.json"); // Firebase’dan olgan kalit
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com"
});
const db = admin.database();

// Bosh sahifa
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "sotuv.html"));
});

// Buyurtma qabul qilish
app.post("/buyurtma", (req, res) => {
  const buyurtma = req.body;

  const ref = db.ref("buyurtmalar");
  const yangiBuyurtma = ref.push();

  yangiBuyurtma.set(buyurtma, (err) => {
    if (err) {
      console.error("Xatolik:", err);
      res.status(500).send("Xatolik yuz berdi");
    } else {
      res.send("Buyurtma qabul qilindi!");
    }
  });
});

// 404
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishlayapti`);
});
