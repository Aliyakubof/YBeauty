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
