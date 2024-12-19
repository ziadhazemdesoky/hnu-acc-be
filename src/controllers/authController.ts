import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/User";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract username and password from request body
    const { username, password }: { username: string; password: string } = req.body;

    // Find user in the database
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: "اسم المستخدم أو كلمة المرور غير صحيح." });
      return;
    }

    // Compare the provided password with the hashed password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ message: "اسم المستخدم أو كلمة المرور غير صحيح." });
      return;
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "default_secret", // Use a fallback for the secret
      { expiresIn: "1d" }
    );

    // Send the token back to the client
    res.status(200).json({ token });
  } catch (err: unknown) {
    // Catch any unexpected errors and ensure type safety
    res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message || "Unknown error",
    });
  }
};
