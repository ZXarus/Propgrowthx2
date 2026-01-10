import { supabase } from "../config/supabase.js";
import fs from "fs";

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

export const updatePropertyPic = async (req, res) => {
  const { id } = req.params;
  const file = req.file;

  try {
    if (!id) {
      return res.status(400).json({ error: "Property ID is required" });
    }

    if (!file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const fileExt = file.originalname.split(".").pop();
    const fileName = `property_${id}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("property-verification")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      return res.status(400).json({ error: uploadError.message });
    }

    const { data: publicData } = supabase.storage
      .from("property-verification")
      .getPublicUrl(fileName);

    const veriImageUrl = publicData.publicUrl;

    const { error: updateError } = await supabase
      .from("properties")
      .update({ veri_image: veriImageUrl })
      .eq("id", id);

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    res.status(200).json({
      message: "Property verification image uploaded successfully",
      veri_image: veriImageUrl,
    });
  } catch (err) {
    console.error("updatePropertyPic error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
