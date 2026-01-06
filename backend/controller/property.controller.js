import { supabase } from "../config/supabase.js";
import fs from "fs";
import path from "path";

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
  const { owner_id } = req.query;

  if (!owner_id) {
    return res.status(400).json({ error: "Owner ID is required" });
  }

  try {
    // Fetch all properties of the owner
    const { data: properties, error } = await supabase
      .from("properties")
      .select("*")
      .eq("owner_id", owner_id);

    if (error) throw error;

    const propertiesWithImages = await Promise.all(
      properties.map(async (prop) => {
        const { data: images, error: imgError } = await supabase
          .from("property_images")
          .select("*")
          .eq("prop_id", prop.id);

        if (imgError) console.log("Error fetching images:", imgError.message);

        return {
          ...prop,
          images: images || [],
        };
      })
    );

    res.status(200).json({
      owner_id,
      properties: propertiesWithImages,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllPropertiesByBuyer = async (req, res) => {
  const { buyer_id } = req.query;

  if (!buyer_id) {
    return res.status(400).json({ error: "Owner ID is required" });
  }

  try {
    // Fetch all properties of the owner
    const { data: properties, error } = await supabase
      .from("properties")
      .select("*")
      .eq("buyer_id", buyer_id);

    if (error) throw error;

    const propertiesWithImages = await Promise.all(
      properties.map(async (prop) => {
        const { data: images, error: imgError } = await supabase
          .from("property_images")
          .select("*")
          .eq("prop_id", prop.id);

        if (imgError) console.log("Error fetching images:", imgError.message);

        return {
          ...prop,
          images: images || [],
        };
      })
    );

    res.status(200).json({
      buyer_id,
      properties: propertiesWithImages,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: err.message });
  }
};
export const getAll = async (req, res) => {
  try {
    // Fetch all properties
    const { data: properties, error: propError } = await supabase
      .from("properties")
      .select("*");

    if (propError) throw propError;

    // Fetch all images in one go
    const { data: allImages, error: imgError } = await supabase
      .from("property_images")
      .select("*");

    if (imgError) throw imgError;

    // Map images to their respective property
    const propertiesWithImages = properties.map((prop) => ({
      ...prop,
      images: allImages.filter((img) => img.prop_id === prop.id) || [],
    }));

    res.status(200).json({
      properties: propertiesWithImages,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const createProperty = async (req, res) => {
  try {
    const {
      owner_id,
      property_name,
      address,
      prize,
      property_type,
      total_area,
      water_available,
      electricity_available,
      availability_status,
      monthly_rent,
    } = req.body;
    console.log(req.body);

    const { data: property, error } = await supabase
      .from("properties")
      .insert([
        {
          owner_id,
          property_name,
          address,
          prize,
          property_type,
          total_area,
          water_available,
          electricity_available,
          availability_status,
          monthly_rent,
        },
      ])
      .select()
      .single();
    console.log("property" + property);

    if (error) throw error;

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileBuffer = fs.readFileSync(file.path);
        const fileName = `property-${property.id}/${file.filename}`;

        const { error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(fileName, fileBuffer, {
            contentType: file.mimetype,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from("property-images")
          .getPublicUrl(fileName);
        if (!publicUrl.publicUrl) throw new Error("Failed to get public URL");

        const { error: insertError } = await supabase
          .from("property_images")
          .insert([
            {
              prop_id: property.id,
              prop_image: publicUrl.publicUrl,
            },
          ]);

        if (insertError) throw insertError;
      }
    }

    return res.status(201).json({
      message: "Property created with images",
      property,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateProperty = async (req, res) => {
  const { id } = req.params;

  const {
    property_name,
    address,
    prize,
    property_type,
    total_area,
    water_available,
    electricity_available,
    availability_status,
    monthly_rent,
    deleteImageIds, // <-- array of image IDs
  } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Property ID is required" });
  }

  try {
    /* ================= UPDATE PROPERTY DATA ================= */
    const updateData = {};

    if (property_name !== undefined) updateData.property_name = property_name;
    if (address !== undefined) updateData.address = address;
    if (prize !== undefined) updateData.prize = prize;
    if (property_type !== undefined) updateData.property_type = property_type;
    if (total_area !== undefined) updateData.total_area = total_area;
    if (water_available !== undefined)
      updateData.water_available = water_available;
    if (electricity_available !== undefined)
      updateData.electricity_available = electricity_available;
    if (availability_status !== undefined)
      updateData.availability_status = availability_status;
    if (monthly_rent !== undefined) updateData.monthly_rent = monthly_rent;

    const { data: property, error } = await supabase
      .from("properties")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    /* ================= DELETE IMAGES ================= */
    if (deleteImageIds?.length) {
      const ids = Array.isArray(deleteImageIds)
        ? deleteImageIds
        : [deleteImageIds];

      // get image paths
      const { data: images } = await supabase
        .from("property_images")
        .select("*")
        .in("id", ids);

      for (const img of images) {
        const filePath = img.prop_image.split("/property-images/")[1];

        // delete from supabase storage
        await supabase.storage.from("property-images").remove([filePath]);
      }

      // delete db records
      await supabase.from("property_images").delete().in("id", ids);
    }

    /* ================= ADD NEW IMAGES ================= */
    if (req.files?.length) {
      for (const file of req.files) {
        const buffer = fs.readFileSync(file.path);
        const fileName = `property-${id}/${file.filename}`;

        const { error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(fileName, buffer, {
            contentType: file.mimetype,
          });

        if (uploadError) throw uploadError;

        const { data: url } = supabase.storage
          .from("property-images")
          .getPublicUrl(fileName);

        await supabase.from("property_images").insert({
          prop_id: id,
          prop_image: url.publicUrl,
        });
      }
    }

    res.status(200).json({
      message: "Property updated successfully",
      property,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const buyProperty = async (req, res) => {
  const { userId, propId } = req.body;
  const { data, error } = await supabase
    .from("properties")
    .update({ buyer_id: userId })
    .eq("id", propId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json({ message: "Property purchased successfully" });

  if (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createReview = async (req, res) => {
  const { property_id, user_id, rating, review } = req.body;

  try {
    /* ===============================
       1️⃣ Validate input
    =============================== */
    if (!property_id || !user_id || !rating || !review) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    /* ===============================
       2️⃣ Get user details
    =============================== */
    const { data: user, error: userError } = await supabase
      .from("profiles")
      .select("id, name")
      .eq("id", user_id)
      .single();

    if (userError) throw userError;

    /* ===============================
       3️⃣ Insert review
    =============================== */
    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          user_id,
          user_name: user.name,
          user_photo: "#",
          rating,
          review,
        },
      ])
      .select()
      .single();

    if (error) throw error;

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

    // reviews + profile join
    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        id,
        review,
        rating,
        created_at,
      `
      )
      .eq("property_id", propertyId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // format response
    const formatted = data.map((r) => ({
      id: r.id,
      review: r.review,
      rating: r.rating,
      user_name: r.profiles?.name || "Anonymous",
      photo: "#", // future ke liye
      created_at: r.created_at,
    }));

    res.status(200).json({
      reviews: formatted,
    });
  } catch (err) {
    console.error("Review fetch error:", err);
    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= CREATE NOTIFICATION =================
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

    res.status(201).json({
      success: true,
      notification: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ================= GET ALL NOTIFICATIONS =================
export const getAllNotifications = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json({
      notifications: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ================= CREATE COMPLAINT =================
export const createComplaint = async (req, res) => {
  const { property_id, tenant_id, complaint } = req.body;

  if (!property_id || !tenant_id || !complaint) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    // 🔹 find owner_id from property
    const { data: property, error: propError } = await supabase
      .from("properties")
      .select("owner_id")
      .eq("id", property_id)
      .single();

    if (propError) throw propError;

    // 🔹 insert complaint
    const { data, error } = await supabase
      .from("complaints")
      .insert([
        {
          property_id,
          tenant_id,
          owner_id: property.owner_id,
          complaint,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      complaint: data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= GET COMPLAINTS (OWNER / TENANT) =================
export const getUserComplaints = async (req, res) => {
  const { userId } = req.params;

  try {
    const { data, error } = await supabase
      .from("complaints")
      .select("*")
      .or(`tenant_id.eq.${userId},owner_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json({ complaints: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
