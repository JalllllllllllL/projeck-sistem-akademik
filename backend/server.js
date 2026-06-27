const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const siswaRoutes = require('./routes/siswaRoutes');
const guruRoutes = require('./routes/guruRoutes');
const beritaRoutes = require('./routes/beritaRoutes');
const rankingRoutes = require('./routes/rankingRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRoutes);
app.use('/api/siswa', siswaRoutes);
app.use('/api/guru', guruRoutes);
app.use('/api/berita', beritaRoutes);
app.use('/api/ranking', rankingRoutes);

app.get('/api/ping', (req, res) => res.json({ message: 'pong' }));

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Backend berjalan di http://localhost:${port}`);
});
