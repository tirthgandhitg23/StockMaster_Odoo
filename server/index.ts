import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// --- 1. EMAIL CONFIGURATION ---
// REPLACE THIS WITH YOUR OWN GMAIL DETAILS
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'stockmaster577@gmail.com', // <--- REPLACE THIS
    pass: 'obuauvyjlerywxke'          // <--- REPLACE THIS (Not your normal password)
  }
});

// --- 2. MOCK DATABASE ---
let users: any[] = [
  {
    id: 1,
    name: "Manager User",
    email: "manager@example.com",
    password: "123",
    role: "manager"
  },
  {
    id: 2,
    name: "Staff User",
    email: "staff@example.com",
    password: "123",
    role: "staff"
  }
];

let products: any[] = [
  {
    id: 101,
    name: "Sample Product",
    category: "General",
    price: 100,
    stock: 50,
    unit: "Pieces",
    reorderPoint: 10
  }
];

// --- ROUTES ---

// SIGN UP
app.post('/api/signup', (req, res) => {
  const { name, email, password, role } = req.body;
  const existingUser = users.find(u => u.email === email);
  if (existingUser) return res.status(400).json({ message: "User exists." });

  const newUser = { 
    id: Date.now(), 
    name, 
    email, 
    password, 
    role: role || "staff" 
  };
  users.push(newUser);
  res.status(201).json({ message: "Account created!", user: newUser });
});

// LOGIN
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.json({ 
      message: "Login successful", 
      token: `token-${user.id}-${Date.now()}`,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// GET ALL PRODUCTS
app.get('/api/products', (req, res) => {
  res.json(products);
});

// CREATE PRODUCT
app.post('/api/products', (req, res) => {
  const productData = req.body;
  if (!productData.name) {
    return res.status(400).json({ message: "Product Name is required" });
  }
  const newProduct = {
    id: Date.now(),
    ...productData,
    stock: Number(productData.initialStock) || 0,
    price: Number(productData.price) || 0,
    reorderPoint: Number(productData.reorderPoint) || 0
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// --- FORGOT PASSWORD (FIXED) ---
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate 4-digit OTP
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
    // --- SENDING EMAIL ---
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}: ${otp}`);
    
    // We send debugOtp so your Frontend can verify it
    res.json({ message: "Email sent successfully", debugOtp: otp });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ message: "Failed to send email. Check credentials in index.ts" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});