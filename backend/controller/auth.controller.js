import { supabase } from "../config/supabase.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { generateToken } from "../middlewares/jwt.middleware.js";

export const register = async (req, res) => {
  const { email, password, role } = req.body;
  console.log(email, password, role);

  if (!email || !password || !role) {
    return res
      .status(400)
      .json({ error: "Email, password, and role are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const { data, error } = await supabase
      .from("profiles")
      .insert({
        email,
        role,
        password: hashedPassword,
      })
      .select()
      .single();
    console.log(data);

    if (error) {
      console.log("Error inserting user:", error.message);
      return res.status(400).json({ error: error.message });
    }
    console.log("here");

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

    const otp = Math.floor(100000 + Math.random() * 900000);

    await supabase.from("verifyOtp").delete().eq("email", email);

    await supabase.from("verifyOtp").insert({
      email,
      otp,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "user ur email",
        pass: "ueie zsqg qplm twqa",
      },
    });

    await transporter.sendMail({
      from: "your email",
      to: email,
      subject: "Your OTP Verification",
      text: `Your OTP is ${otp}.`,
    });

    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.log("Forgot password error:", err.message);
    return res
      .status(500)
      .json({ error: err.message + "mail is not defined so make it correct" });
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ password: hashedPassword })
      .eq("email", email);

    if (updateError) {
      return res.status(500).json({ error: "Password update failed" });
    }

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

export const profileDeatils = async (req, res) => {
  const { profileId } = req.params;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
        id,
        email,
        role,
        name,
        emer_contact,
        profile_image,
        s_link1,
        s_link2,
        s_link3,
        created_at
      `
      )
      .eq("id", profileId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json({ profile: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const updateProfile = async (req, res) => {
  const { profileId } = req.params;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const file = req.file;
    const fileExt = file.originalname.split(".").pop();
    const fileName = `${profileId}-${Date.now()}.${fileExt}`;
    const filePath = `profiles/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("profile-images")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrl } = supabase.storage
      .from("profile-images")
      .getPublicUrl(filePath);

    const { error } = await supabase
      .from("profiles")
      .update({ profile_image: publicUrl.publicUrl })
      .eq("id", profileId);

    if (error) throw error;

    res.status(200).json({
      success: true,
      profile_image: publicUrl.publicUrl,
    });
  } catch (err) {
    console.error("Profile image update error:", err);
    res.status(500).json({ error: err.message });
  }
};
export const updatedetails = async (req, res) => {
  const { profileId } = req.params;
  const { emer_contact, s_link1, s_link2, s_link3, name, email } = req.body;

  if (!emer_contact && !s_link1 && !s_link2 && !s_link3) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  try {
    const updates = {};
    if (emer_contact) updates.emer_contact = emer_contact;
    if (s_link1) updates.s_link1 = s_link1;
    if (s_link2) updates.s_link2 = s_link2;
    if (s_link3) updates.s_link3 = s_link3;

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", profileId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      profile: data,
    });
  } catch (err) {
    console.error("Update profile details error:", err);
    res.status(500).json({ error: err.message });
  }
};
