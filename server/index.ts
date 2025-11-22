import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer'; // Import Nodemailer

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// --- EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'stockmaster577@gmail.com', // <--- PUT YOUR EMAIL HERE
    pass: 'obuauvyjlerywxke'    // <--- PUT YOUR GMAIL APP PASSWORD HERE
  }
});

// --- MOCK DATABASE ---
let users: any[] = [
  {
    id: 1,
    name: "Demo User",
    email: "test@example.com",
    password: "123",
  }
];

// --- ROUTES ---

// 1. SIGN UP
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = users.find(u => u.email === email);
  if (existingUser) return res.status(400).json({ message: "User exists." });

  const newUser = { id: Date.now(), name, email, password };
  users.push(newUser);
  res.status(201).json({ message: "Account created!", user: newUser });
});

// 2. LOGIN
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.json({ 
      message: "Login successful", 
      token: `token-${user.id}-${Date.now()}`,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// 3. FORGOT PASSWORD (SENDS REAL EMAIL)
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate OTP
  const otp = Math.floor(1000 + Math.random() * 9000);

  // Email Options
  const mailOptions = {
    from: '"StockMaster Support" <no-reply@stockmaster.com>',
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}`, 
    html: `<b>Your OTP for password reset is: ${otp}</b>` 
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}: ${otp}`); // Still log for debugging
    
    // Send OTP back to frontend for verification logic (optional security risk in production, ok for student project)
    res.json({ message: "Email sent successfully", debugOtp: otp });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ message: "Failed to send email. Check server logs." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});