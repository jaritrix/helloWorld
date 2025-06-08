require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const bodyParser = require('body-parser'); // express.json() is preferred now

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Replaces bodyParser.json() for parsing JSON request bodies

// MongoDB Atlas connection
// Using process.env.MONGO_URI to keep credentials secure
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));


// --- User Schema with Security Features ---
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For authentication tokens

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensures username is unique
    trim: true    // Removes whitespace from ends
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email is unique
    lowercase: true, // Converts email to lowercase
    trim: true
  },
  password: {
    type: String,
    required: true
  },
}, {
  collection: 'signin', // Your specified collection name
  timestamps: true      // Adds createdAt and updatedAt fields
});

// Pre-save hook to hash password before saving to database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) { // Only hash if password field is modified
        return next();
    }
    const salt = await bcrypt.genSalt(10); // Generate a salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next();
});

// Method to compare candidate password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);


// --- Routes ---

// Signup route
app.post('/signup', async (req, res) => {
  const { username, name, email, password } = req.body;

  // Input validation
  if (!username || !name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' }); // Use 400 Bad Request
  }

  try {
    // Check if user already exists by username or email
    let userByUsername = await User.findOne({ username });
    if (userByUsername) {
      return res.status(409).json({ message: 'Username already taken.' }); // Use 409 Conflict
    }

    let userByEmail = await User.findOne({ email });
    if (userByEmail) {
      return res.status(409).json({ message: 'Email already exists.' }); // Use 409 Conflict
    }

    // Create new user (password will be hashed by the pre-save hook)
    const newUser = new User({ username, name, email, password });
    await newUser.save();

    // Generate JWT Token for immediate login after signup
    const payload = {
      user: {
        id: newUser.id,
        username: newUser.username // Include username in payload
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ // Use 201 Created for successful resource creation
          message: 'Signup successful',
          token,
          username: newUser.username // Send username back to frontend
        });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error'); // Use 500 Internal Server Error for unhandled exceptions
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  // Input validation
  if (!usernameOrEmail || !password) {
    return res.status(400).json({ message: 'Please enter both username/email and password.' });
  }

  try {
    // Find user by username or email
    let user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials.' });
    }

    // Compare provided password with hashed password from database
    const isMatch = await user.comparePassword(password); // Use the method defined in schema
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials.' });
    }

    // Generate JWT Token on successful login
    const payload = {
      user: {
        id: user.id,
        username: user.username
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ // Default 200 OK
          message: 'Login successful',
          token,
          username: user.username
        });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Start server
// Use process.env.PORT to allow Render to assign a port, with 3000 as a fallback for local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});