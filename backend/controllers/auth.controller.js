import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from "../config/database.js";

// ------------------ REGISTER ------------------
const register = async (req, res) => {
  const { email, password, role = "donor" } = req.body;

  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users 
       (public_id, email, password_hash, role, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW())
       RETURNING id, email, role`,
      [email, hashedPassword, role]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        role: result.rows[0].role
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------ LOGIN ------------------
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------ FORGOT PASSWORD ------------------
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0)
      return res.status(400).json({ message: "User not found" });

    const user = result.rows[0];

    // Générer token temporaire pour reset
    const token = jwt.sign(
      { id: user.id, email: user.email, purpose: "reset" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Générer le lien complet vers le front
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // Pour dev, on renvoie le lien directement
    // Plus tard, tu peux envoyer le mail via nodemailer ici
    res.json({
      message: "Password reset link generated",
      resetLink,
      token
    });
  } catch (error) {
    console.error("ForgotPassword error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------ RESET PASSWORD ------------------
const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password)
    return res.status(400).json({ message: "Token and password required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.purpose !== "reset")
      return res.status(400).json({ message: "Invalid token purpose" });

    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1 AND email = $2",
      [decoded.id, decoded.email]
    );

    if (result.rows.length === 0)
      return res.status(400).json({ message: "User not found" });

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2",
      [hashed, decoded.id]
    );

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("ResetPassword error:", err);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// ------------------ EXPORT ------------------
export default { register, login, forgotPassword, resetPassword };
