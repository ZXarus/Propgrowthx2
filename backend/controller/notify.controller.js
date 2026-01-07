import { supabase } from "../config/supabase.js";

export const createNotification = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const { data, error } = await supabase
      .from("notifications")
      .insert([{ message }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, notification: data });
  } catch (err) {
    console.error("Create public notification error:", err);
    res
      .status(500)
      .json({ error: err.message || "Failed to create notification" });
  }
};

export const privateCreateNotification = async (req, res) => {
  try {
    const { message, tenant_id, owner_id } = req.body;

    if (!message || (!tenant_id && !owner_id)) {
      return res
        .status(400)
        .json({ error: "Message and at least one recipient are required" });
    }

    const { data, error } = await supabase
      .from("notifications")
      .insert([
        { message, tenant_id: tenant_id || null, owner_id: owner_id || null },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, notification: data });
  } catch (err) {
    console.error("Create private notification error:", err);
    res
      .status(500)
      .json({ error: err.message || "Failed to create notification" });
  }
};

export const getNotificationsForUser = async (req, res) => {
  try {
    const { userId } = req.query;

    let query = supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.or(
        `tenant_id.eq.${userId},owner_id.eq.${userId},tenant_id.is.null,owner_id.is.null`
      );
    }

    const { data, error } = await query;

    if (error) throw error;

    res.status(200).json({ notifications: data });
  } catch (err) {
    console.error("Fetch notifications error:", err);
    res
      .status(500)
      .json({ error: err.message || "Failed to fetch notifications" });
  }
};

export const updateNotification = async (req, res) => {
  const { notificationId } = req.params;
  const { message, tenant_id, owner_id } = req.body;

  if (!message && !tenant_id && !owner_id) {
    return res
      .status(400)
      .json({ error: "At least one field is required to update" });
  }

  try {
    const updates = {};
    if (message) updates.message = message;
    if (tenant_id !== undefined) updates.tenant_id = tenant_id;
    if (owner_id !== undefined) updates.owner_id = owner_id;

    const { data, error } = await supabase
      .from("notifications")
      .update(updates)
      .eq("id", notificationId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ success: true, notification: data });
  } catch (err) {
    console.error("Update notification error:", err);
    res
      .status(500)
      .json({ error: err.message || "Failed to update notification" });
  }
};

export const deleteNotification = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const { data, error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      notification: data,
    });
  } catch (err) {
    console.error("Delete notification error:", err);
    res
      .status(500)
      .json({ error: err.message || "Failed to delete notification" });
  }
};
