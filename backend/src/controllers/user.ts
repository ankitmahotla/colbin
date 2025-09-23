import { eq } from "drizzle-orm";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { asyncHandler } from "../utils/async-handler";
import { password as passwordUtil } from "bun";
import * as z from "zod";
import jwt from "jsonwebtoken";

const userSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const register = asyncHandler(async (req, res) => {
  const { email, password: rawPassword } = req.body;
  if (!email || !rawPassword) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const parsed = userSchema.safeParse({
    email: email.trim(),
    password: rawPassword.trim(),
  });
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.message });
  }

  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (existing.length) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const hashedPassword = await passwordUtil.hash(rawPassword);

  try {
    const user = await db
      .insert(usersTable)
      .values({
        email: email.trim(),
        password: hashedPassword,
      })
      .returning({
        id: usersTable.id,
        email: usersTable.email,
      });
    return res
      .status(201)
      .json({ message: "User registered successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Error registering user" });
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const parsed = userSchema.safeParse({
    email: email.trim(),
    password: password.trim(),
  });
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.message });
  }
  try {
    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.trim()))
      .limit(1);

    if (existing.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = existing[0];
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await passwordUtil.verify(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email/password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    return res.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in" });
  }
});

export const me = asyncHandler(async (req, res) => {
  const id = req.user.id;

  try {
    const user = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Profile retrieved successfully", user: user[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error retrieving profile" });
  }
});
