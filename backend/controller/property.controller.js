import { supabase } from "../config/supabase.js";

export const getPropertyById = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Property ID is required" });
  }

  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single(); // fetch single property

    if (error || !data) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.status(200).json({ property: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllPropertiesByOwner = async (req, res) => {
  const { owner_id } = req.query; // or req.query.owner_id

  if (!owner_id) {
    return res.status(400).json({ error: "Owner ID is required" });
  }

  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("owner_id", owner_id);

    if (error) {
      console.log("Error fetching properties:", error.message);
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      owner_id,
      properties: data,
    });
  } catch (err) {
    console.log("Unexpected error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const createProperty = async (req, res) => {
  const { owner_id, name, address } = req.body;

  if (!owner_id || !name) {
    return res
      .status(400)
      .json({ error: "Owner ID and property name are required" });
  }

  try {
    // Insert property linked to owner_id
    const { data, error } = await supabase
      .from("properties")
      .insert([{ owner_id, name, address }])
      .select()
      .single();

    if (error) {
      console.log("Error creating property:", error.message);
      return res.status(400).json({ error: error.message });
    }

    console.log("Property created successfully:", data);

    res.status(201).json({
      message: "Property created successfully",
      property: data,
    });
  } catch (err) {
    console.log("Unexpected error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const updateProperty = async (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Property ID is required" });
  }

  try {
    const updateData = {};
    if (name) updateData.name = name;
    if (address) updateData.address = address;

    const { data, error } = await supabase
      .from("properties")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      message: "Property updated successfully",
      property: data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
