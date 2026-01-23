const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

// ================= DATABASE =================
let db;

async function initDB() {
  try {
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Sagar@123',
      database: 'medical'
    });
    console.log('✅ Connected to MySQL database');
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
}

initDB();

// ================= REGISTER =================
app.post('/register', async (req, res) => {
  const { fullname, phonenumber, email, password, confirmpassword, gender } = req.body;

  if (!fullname || !phonenumber || !email || !password || !confirmpassword || !gender) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmpassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const [existingUser] = await db.execute(
      'SELECT id FROM register WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      'INSERT INTO register (fullname, phonenumber, email, password, gender) VALUES (?, ?, ?, ?, ?)',
      [fullname, phonenumber, email, hashedPassword, gender]
    );

    res.status(201).json({ message: "Registration successful" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ================= LOGIN =================
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const [users] = await db.execute(
      'SELECT * FROM register WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        gender: user.gender
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ================= SERVER =================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
