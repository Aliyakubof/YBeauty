const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");

// Firebase service account kaliti
const serviceAccount = {
  "type": "service_account",
  "project_id": "ybeauty-f45b6",
  "private_key_id": "37d3f789742ba30484004a0defa7bc56bbf1d4b1",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCrNaIfY+qEWEyq\nJFed/PrVG4hFLRXRuHSFg10u4CtXlTqLbGDexJ+ctjSZ1KPkAxIxSoyXOWAf7dw2\nUpqRKF3EBPCq51qtpaFEgN88TzjzNDma1uDb3yvPN092BauPj45DQf80nuOgCTsp\nq/RmcojkNxuAQFlI6wMtlWUxuZNA3PLc1ZKWhJ5+gz1VX9ZBa7yq5zIovfujVdYh\nhEgu1BdcmIXvB87WDjGWI1vi2YaejTek/HYugM9/FAsqhGLiKBPaqQwGnn0epuLJ\nY+yggu5h0z3XyKnv9+URP6pMxNu2y9Td+C/U/UBoRzxg//E5hXECKIzTP9oRhkhD\nlfgCv3+BAgMBAAECggEAAaZYk6uUQBCgzH5wrYpW2WSe2IBIeoCOSSDVpnn8cO75\nmFPI8tyXn7YBII4xmfGs/exIimBZuMb2olpAx9gvagDH8Y5LZ/UejQcUFWA2YEay\nou0XyrnN47VJYCx9fminFc/KmCs21LVl50TlPdlnQO5I7q01Lwv50ci1oq8cERsg\nXsVyIZPg38krnM1XLyR1vnkF3t8Yhr6WRLLXQ/V9NKDqhjgakO0AAn4GH1KMNqEi\nFNwd1CW+uh0H8xHnYLxurSKvX1k5CrJ+88rRjnk4trV+bAkvmUVyhVN617LsqZ06\nGfvtnxkiJMvEdf887Sb9mw/Dlr8exAKWgwf3BXbF8QKBgQDoSwLUf4GthEnDZEh+\nUEFN6B415gSZh5J6pTu3l1Yz3jpyae1V/N3PRx9fMjQI6tftmc/SjOzCbGnoIoYS\nGOUbnKB1aipE5p2z7ycgrCnVjnq6x99Hi7T4TpIby2XwqhS6FMkE6yhFQ7WCTu5z\nMyberXGuc28XMMb8dqlRnFsyKwKBgQC8rrpQWsDUHxQ7RC3KWlE/ljUpUNxkWJJN\nYFVbT1JZllk7HENW5hPKe+rEXXwKGXIQ8BSGNS0vs0om4cDf1WcCogOEmVvea8lX\nXr2k+BYaNz4LfWxrMHf/zrWH5fb/Id8sW7jUVOaSx8JQ3enpFEhwa7P6ad+FGF3k\niV/qklo7AwKBgFgoX6KV4Xkgw33MCVcmziHq/cwmx4gc05KIMumyHZ0BsdzKJrCD\njwqjS1ytiOH5folF3oFhyljfHDJlJ8ymdgzMnHjzGaecfi1Tjd3weM/7ishoImzc\nsImsB/dUchOr+MHGMaQUOuxOjgwuOICv4QiReptiY77BXENkJU47sMCRAoGAFhFV\nhypmHSkZY6kgtecEU6yMwS1M6YuWaOhYc1p+pi24d/phQduc+vStS5QnesLpHWQG\n8n9rroWIqa2DsmoyJxOt16dcIFJ49PgGtDGz3BMT9aIQuSStFEUn5CIYVlSu1nBP\n2L2pTgeBCZY60mDl7Agcv6/8TYPBD4alqji9xuMCgYAVccw2BDKGh+luFzS6cm7S\nHbNq6Taot6fCsLJSxweN73pMAa5/edQlQMcm48wJE2DVUhbYtBn6CJY7/RvAqmsl\nr+56GJQSpFYIYwxN+/9SY9/zWCaCOHmc4ag/FYDthRl3NPc8sSGOL35O0dkkfDvW\nORUjONdJYR5/KvUJLaX+hg==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@ybeauty-f45b6.iam.gserviceaccount.com",
  "client_id": "112447355362377033803",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40ybeauty-f45b6.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ybeauty-f45b6-default-rtdb.firebaseio.com"
});

const db = admin.database();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

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
