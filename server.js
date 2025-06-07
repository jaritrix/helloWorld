const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas connection
mongoose.connect('mongodb+srv://gk537660:gk537660@signupdatabase.yxzdgsu.mongodb.net/signupdat?retryWrites=true&w=majority&appName=signupdatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema (collection name set to 'sigbuppdata')
const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
}, { collection: 'signin' }); // <-- yahi chahiye

const User = mongoose.model('User', userSchema);

// Signup route
app.post('/signup', async (req, res) => {
  const { username, name, email, password } = req.body;
  if (!username || !name || !email || !password) {
    return res.json({ message: 'All fields required' });
  }
  const userExists = await User.findOne({ $or: [{ username }, { email }] });
  if (userExists) {
    return res.json({ message: 'Username or Email already exists' });
  }
  await User.create({ username, name, email, password });
  res.json({ message: 'Signup successful' }); // <-- Yahi hona chahiye
});

// Login route
app.post('/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    password,
  });
  if (user) {
    res.json({ message: 'Login successful' });
  } else {
    res.json({ message: 'Invalid credentials' });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});