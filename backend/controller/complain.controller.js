import { supabase } from "../config/supabase.js";

export const createComplaint = async (req, res) => {
  const { property_id, tenant_id, message } = req.body;

  if (!property_id || !tenant_id || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const { data: property, error: propError } = await supabase
      .from("properties")
      .select("owner_id")
      .eq("id", property_id)
      .single();

    if (propError) {
      return res.status(404).json({ error: "Property not found" });
    }

    const { data, error } = await supabase
      .from("complains")
      .insert([
        {
          property_id,
          tenant_id,
          owner_id: property.owner_id,
          message,
          status: "pending",
          checked_at: null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, complaint: data });
  } catch (err) {
    console.error("Complaint error:", err);
    res
      .status(500)
      .json({ error: err.message || "Failed to create complaint" });
  }
};

export const getUserComplaints = async (req, res) => {
  const { userId } = req.params;

  try {
    const { data: user, error: userError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    let query = supabase
      .from("complains")
      .select("*")
      .order("created_at", { ascending: false });

    if (user.role === "owner") {
      query = query.eq("owner_id", userId);
    } else if (user.role === "tenant") {
      query = query.eq("tenant_id", userId);
    } else {
      return res.status(400).json({ error: "Invalid user role" });
    }

    const { data, error } = await query;

    if (error) throw error;

    res.status(200).json({ complaints: data });
  } catch (err) {
    console.error("Fetch complaints error:", err);
    res
      .status(500)
      .json({ error: err.message || "Failed to fetch complaints" });
  }
};

export const updateComplaint = async (req, res) => {
  const { complaintId } = req.params;
  const { message, status, checked_at } = req.body;

  if (!message && !status && !checked_at) {
    return res
      .status(400)
      .json({ error: "At least one field is required to update" });
  }

  try {
    const updates = {};
    if (message) updates.message = message;
    if (status) updates.status = status;
    if (checked_at) updates.checked_at = checked_at;

    const { data, error } = await supabase
      .from("complains")
      .update(updates)
      .eq("id", complaintId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ success: true, complaint: data });
  } catch (err) {
    console.error("Update complaint error:", err);
    res
      .status(500)
      .json({ error: err.message || "Failed to update complaint" });
  }
};

export const deleteComplaint = async (req, res) => {
  const { complaintId } = req.params;

  try {
    const { data, error } = await supabase
      .from("complains")
      .delete()
      .eq("id", complaintId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
      complaint: data,
    });
  } catch (err) {
    console.error("Delete complaint error:", err);
    res
      .status(500)
      .json({ error: err.message || "Failed to delete complaint" });
  }
};
