const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const ordersFile = path.join(__dirname, 'orders.json');

function getOrders() {
  if (!fs.existsSync(ordersFile)) return [];
  return JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
}

function saveOrders(orders) {
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
}

app.post('/api/orders', (req, res) => {
  const order = req.body;
  const orders = getOrders();
  orders.push(order);
  saveOrders(orders);
  res.json({ success: true });
});

app.get('/api/orders', (req, res) => {
  const key = req.query.key;
  if (key !== 'admin123') return res.status(403).json({ error: 'Siz admin emassiz!' });
  res.json(getOrders());
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
