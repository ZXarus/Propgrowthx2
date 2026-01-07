import { supabase } from "../config/supabase.js";

export const createReview = async (req, res) => {
  const { property_id, user_id, rate, message } = req.body;

  try {
    if (!property_id || !user_id || rate === undefined || !message) {
      return res.status(400).json({
        error: "All fields are required: property_id, user_id, rate, message",
      });
    }

    const { data: user, error: userError } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", user_id)
      .single();

    if (userError) {
      return res.status(404).json({ error: "User not found" });
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          rev_id: property_id,
          user_id,
          user_name: user.name,
          rate,
          message,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({
      message: "Review added successfully",
      review: data,
    });
  } catch (err) {
    console.error("Review error:", err);
    res.status(500).json({
      error: err.message || "Failed to add review",
    });
  }
};

export const getReviewsByProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        id,
        rev_id,
        user_id,
        user_name,
        rate,
        message,
        created_at
      `
      )
      .eq("rev_id", propertyId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const formatted = data.map((r) => ({
      id: r.id,
      review: r.message,
      rating: r.rate,
      user_name: r.user_name || "Anonymous",
      created_at: r.created_at,
    }));

    res.status(200).json({
      reviews: formatted,
    });
  } catch (err) {
    console.error("Review fetch error:", err);
    res.status(500).json({
      error: err.message || "Failed to fetch reviews",
    });
  }
};

export const updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rate, message } = req.body;

  if (rate === undefined && !message) {
    return res
      .status(400)
      .json({ error: "At least one field is required to update" });
  }

  try {
    const updates = {};
    if (rate !== undefined) updates.rate = rate;
    if (message) updates.message = message;

    const { data, error } = await supabase
      .from("reviews")
      .update(updates)
      .eq("id", reviewId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ success: true, review: data });
  } catch (err) {
    console.error("Update review error:", err);
    res.status(500).json({ error: err.message || "Failed to update review" });
  }
};

export const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const { data, error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      review: data,
    });
  } catch (err) {
    console.error("Delete review error:", err);
    res.status(500).json({ error: err.message || "Failed to delete review" });
  }
};
