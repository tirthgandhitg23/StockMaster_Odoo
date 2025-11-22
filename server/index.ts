// server/index.ts
import express, { Express, Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors"; // Required for connecting frontend to backend
import { connectDB } from "./db/connection";
import productRoutes from "./routes/productRoutes";
import operationRoutes from "./routes/operationRoutes";
import warehouseRoutes from "./routes/warehouseRoutes";

// Load environment variables from the root .env file
// Note: You must ensure this path is correct if your setup differs.
dotenv.config({ path: "./.env" });

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || "5000", 10);

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Routes ---
app.use("/api/products", productRoutes);
app.use("/api/operations", operationRoutes);
app.use("/api/warehouses", warehouseRoutes);
// --- Email Transporter ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --- ROUTES ---

// 1. SIGNUP ROUTE
app.post('/api/signup', async (req: Request, res: Response): Promise<any> => {
  const { name, username, email, password } = req.body;

  console.log('Signup payload:', { name, username, email });

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists. Please login." });
    }

    // Create new user
    // Hash the password and store it in the model's `password` field
    const passwordHash = await bcrypt.hash(password, 10);
    // Use provided `username` if present, otherwise fall back to `name`
    const finalUsername = username ?? name;
    const newUser = new User({ name, username: finalUsername, email, password: passwordHash });
    await newUser.save();

    return res.status(201).json({ message: "Account created successfully" });

  } catch (error) {
    console.error("Signup Error:", error);
    // If mongoose validation error, return readable messages
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (error && error.name === 'ValidationError') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    return res.status(500).json({ message: "Error creating account" });
  }
});

// 2. LOGIN ROUTE
app.post('/api/login', async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not registered. Please sign up." });
    }

    // Check password (compare plaintext with stored hash in `password`)
    const passwordMatches = await bcrypt.compare(password, user.password as string);
    if (!passwordMatches) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Success
    return res.status(200).json({ 
      message: "Login successful", 
      user: { name: user.username, email: user.email } 
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// 3. FORGOT PASSWORD ROUTE
app.post('/api/forgot-password', async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Check if user exists (Requirement: Only registered users)
    const userExists = await User.findOne({ email });
    
    if (!userExists) {
      return res.status(404).json({ message: "User not found. Please register first." });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Send Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'StockMaster Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email} with OTP: ${otp}`);
    
    // Return OTP for demo/testing
    return res.status(200).json({ message: "OTP sent successfully", debugOtp: otp });

  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({ message: "Failed to send email" });
  }
});

// Health Check
app.get('/', (req: Request, res: Response) => {
  res.status(200).send('StockMaster Backend API is running.');
});

// --- Start Server ---
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`⚡ Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
