import { supabase } from "../config/supabase.js";

export const createComplaint = async (req, res) => {
  const tenant_id = req.user.id;
  const {
    owner_id,
    property_id,
    category,
    priority,
    subject,
    description,
    status,
  } = req.body;

  if (!subject || !description || !category || !priority) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("id, property_name, owner_id")
      .eq("id", property_id)
      .single();

    if (propertyError || !property) {
      return res.status(404).json(propertyError);
    }

    const { data: tenantProfile, error: tenantError } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", tenant_id)
      .single();

    if (tenantError || !tenantProfile) {
      return res.status(404).json({ error: "Tenant profile not found" });
    }

    const { data: ownerProfile, error: ownerError } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", property.owner_id)
      .single();

    if (ownerError || !ownerProfile) {
      return res.status(404).json({ error: "Owner profile not found" });
    }

    const { data, error } = await supabase
      .from("complaints")
      .insert([
        {
          tenant_id,
          tenant_name: tenantProfile.name,

          owner_id: property.owner_id,
          owner_name: ownerProfile.name,

          property_id: property.id,
          property_name: property.name,

          category,
          subject,
          description,

          priority,
          status: "open",
          checked_at: null,

          responses: [],
        },
      ])
      .select()
      .single();

    if (error) {
      console.log(error);
    }

    return res.status(201).json({
      message: "sucessfully fill the complain",
      complaint: data,
    });
  } catch (err) {
    console.error("Create Complaint Error:", err);
    return res.status(500).json({
      error: err.message || "Failed to create complaint",
    });
  }
};

export const getUserComplaints = async (req, res) => {
  const userId = req.user.id;
  const { role } = req.params;

  try {
    let query = supabase
      .from("complaints")
      .select("*")
      .order("created_at", { ascending: false });

    if (role === "owner") {
      query = query.eq("owner_id", userId);
    } else if (role === "tenant") {
      query = query.eq("tenant_id", userId);
    } else {
      return res.status(400).json({ error: "Invalid user role" });
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ comp: [] });
    }

    res.status(200).json({ comp: data || [] });
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

export const deleteOldComplaints = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await supabase
      .from("complains")
      .delete()
      .lte("created_at", sevenDaysAgo.toISOString())
      .select();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: "Old complaints deleted successfully",
      deletedCount: data.length,
      deletedComplaints: data,
    });
  } catch (err) {
    console.error("Auto delete complaints error:", err);
    res.status(500).json({
      error: err.message || "Failed to delete old complaints",
    });
  }
};
