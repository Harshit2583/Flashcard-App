require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const flashcardRoutes = require('./routes/flashcards');
app.use('/api/flashcards', flashcardRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Flashcards API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 