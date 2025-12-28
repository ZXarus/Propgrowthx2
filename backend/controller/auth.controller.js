import { supabase } from "../config/supabase.js";

import bcrypt from "bcryptjs";
import { generateToken } from "../middlewares/jwt.middleware.js";

export const register = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res
      .status(400)
      .json({ error: "Email, password, and role are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("profiles")
      .insert({
        email,
        role,
        password: hashedPassword,
      })
      .select()
      .single();

    if (error) {
      console.log("Error inserting user:", error.message);
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: "Register successful",
    });
  } catch (err) {
    console.log("Unexpected error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: user, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) return res.status(400).json({ error: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const { data: user, error: userError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

    await supabase.from("verifyOtp").delete().eq("email", email);

    await supabase.from("verifyOtp").insert({
      email,
      otp,
    });

    return res.status(200).json({
      message: "OTP sent successfully",
      otp,
    });
  } catch (err) {
    console.log("Forgot password error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
export const passwordUpdate = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and new password are required",
      });
    }

    const { data: user, error: userError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2️⃣ Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Update password
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ password: hashedPassword })
      .eq("email", email);

    if (updateError) {
      return res.status(500).json({ error: "Password update failed" });
    }

    // 4️⃣ Delete OTP after success (security)
    await supabase.from("verifyOtp").delete().eq("email", email);

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (err) {
    console.log("Password update error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP required" });
    }

    const { data, error } = await supabase
      .from("verifyOtp")
      .select("*")
      .eq("email", email)
      .eq("otp", otp)
      .single();

    if (error || !data) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    await supabase.from("verifyOtp").delete().eq("email", email);

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.log("Verify OTP error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getUserProfileWithProperties = async (req, res) => {
  const userId = req.user.id;

  try {
    // Get user profile
    const { data: user, error: userError } = await supabase
      .from("profiles")
      .select("id,role")
      .eq("id", userId)
      .single();

    if (userError || !user)
      return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
