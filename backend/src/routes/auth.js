import express from "express";
import { signup, login } from "../services/auth.js";

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      password.length < 6
    ) {
      return res.status(400).json({
        error:
          "A valid email and a password of at least 6 characters are required.",
      });
    }

    const result = await signup({
      name: typeof name === "string" ? name.trim() : "",
      email: email.trim(),
      password,
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error("Signup error:", error.message);

    return res.status(400).json({
      error: error.message || "Signup failed",
    });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        error: "Email and password are required.",
      });
    }

    const result = await login({
      email: email.trim(),
      password,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(401).json({
      error: error.message || "Login failed",
    });
  }
});

export default router;
