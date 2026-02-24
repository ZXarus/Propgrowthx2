import { supabase } from "../config/supabase.js";
import fs from "fs";
import nodemailer from "nodemailer";

export const getPropertyById = async (req, res) => {
  const { property_Id } = req.params;

  if (!property_Id) {
    return res.status(400).json({ error: "Property ID is required" });
  }

  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", property_Id)
      .single(); // get exact property

    if (error || !data) {
      return res.status(404).json({ error: "Property not found" });
    }

    return res.status(200).json({ property: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getAllPropertiesByUser = async (req, res) => {
  const user_id = req.user.id;
  const { role } = req.params;

  let idTile = "";
  if (role == "owner") {
    idTile = "owner_id";
  } else {
    idTile = "buyer_id";
  }

  if (!user_id) {
    return res.status(400).json({ error: "Owner ID is required" });
  }

  try {
    const { data: properties, error } = await supabase
      .from("properties")
      .select("*")
      .eq(idTile, user_id);

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
      }),
    );

    res.status(200).json({ prop: propertiesWithImages });
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

// export const createProperty = async (req, res) => {
//   const {
//     owner_id,
//     property_name,
//     address,
//     prize,
//     property_type,
//     total_area,
//     water_available,
//     electricity_available,
//     availability_status,
//     monthly_rent,
//   } = req.body;

//   // Required validation
//   if (!owner_id || !property_name) {
//     return res.status(400).json({
//       error: "Owner ID and Property Name are required",
//     });
//   }

//   try {
//     const { data, error } = await supabase
//       .from("properties")
//       .insert([
//         {
//           owner_id,
//           property_name,
//           address,
//           prize,
//           property_type,
//           total_area,
//           water_available,
//           electricity_available,
//           availability_status: availability_status || "available",
//           monthly_rent,
//         },
//       ])
//       .select()
//       .single();

//     if (error) {
//       return res.status(400).json({ error: error.message });
//     }

//     res.status(201).json({
//       message: "Property created successfully",
//       property: data,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

export const createProperty = async (req, res) => {
  const owner_id = req.user.id;

  console.log(owner_id);
  try {
    const {
      property_name,
      description,

      address,
      city,
      state,
      zip_code,

      listing_type,
      property_type,

      monthly_rent,
      price,

      due_date,
      end_date,

      bedrooms,
      bathrooms,
      otherrooms,
      floors,
      total_area,

      amenities,

      status,

      water_available,
      electricity_available,
    } = req.body;

    console.log(req.body);

    const isRent = listing_type === "RENT";

    let parsedAmenities = [];

    if (Array.isArray(amenities)) {
      parsedAmenities = amenities;
    } else if (typeof amenities === "string") {
      parsedAmenities = amenities.split(",").map((a) => a.trim());
    }

    const { data: property, error } = await supabase
      .from("properties")
      .insert([
        {
          owner_id,

          property_name,
          description,

          address,
          city,
          state,
          zip_code,

          listing_type,
          property_type,

          monthly_rent: isRent ? Number(monthly_rent) : null,
          price: !isRent ? Number(price) : null,

          due_date: due_date || null,
          end_date: end_date || null,

          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          otherrooms: Number(otherrooms),
          floors: Number(floors),
          total_area: Number(total_area),

          amenities: parsedAmenities,

          status,

          water_available: water_available === "true",
          electricity_available: electricity_available === "true",

          buyer_id: null,

          inquiries: 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    if (req.files?.images?.length > 0) {
      const imageUrls = [];

      for (const file of req.files.images) {
        const buffer = fs.readFileSync(file.path);
        const fileName = `property-${property.id}/${file.filename}`;

        await supabase.storage
          .from("property-images")
          .upload(fileName, buffer, {
            contentType: file.mimetype,
          });

        const { data } = supabase.storage
          .from("property-images")
          .getPublicUrl(fileName);

        imageUrls.push(data.publicUrl);

        fs.unlinkSync(file.path);
      }
    }

    return res.status(201).json({
      message: "Property created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }

  res.status(201).json({
    message: "Property created successfully",
    property: data,
  });
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

    res.status(201).json({
      message: "Property updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// export const buyProperty = async (req, res) => {
//   const userId = req.user.id;
//   // tenant id
//   console.log(userId);

//   const { property_Id } = req.params;
//   console.log(property_Id);

//   const { data, error } = await supabase
//     .from("properties")
//     .update({ buyer_id: userId })
//     .eq("id", property_Id);

//   if (error) {
//     return res.status(500).json({ error: error.message });
//   }

//   createPayment();

//   return res.status(200).json({ message: "Property purchased successfully" });

//   if (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

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

export const requestForInvitation = async (req, res) => {
  try {
    const {
      property_name,
      status,
      total_area,
      address,
      property_type,
      city,
      state,
      tenantId,
      owner_id,
      property_Id,
    } = req.body;

    const { data: tenant } = await supabase
      .from("profiles")
      .select("name, email, emer_contact")
      .eq("id", tenantId)
      .single();

    const { data: owner } = await supabase
      .from("profiles")
      .select("name, email")
      .eq("id", owner_id)
      .single();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.COMPANY_EMAIL,
        pass: process.env.COMPANY_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"PROPGROWTHX" <${process.env.COMPANY_EMAIL}>`,
      to: owner.email,
      subject: "New Tenant Request for Your Property",
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f6f8;
      padding: 20px;
    }
    .card {
      max-width: 600px;
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      margin: auto;
    }
    h2 {
      color: #2c3e50;
      border-bottom: 1px solid #ddd;
      padding-bottom: 8px;
    }
    .section {
      margin-top: 15px;
    }
    .label {
      font-weight: bold;
      color: #555;
    }
    .value {
      color: #000;
    }
    .footer {
      margin-top: 20px;
      font-size: 13px;
      color: #777;
      text-align: center;
    }
  </style>
</head>
<body>

  <div class="card">
    <h2>Tenant Interested in Your Property</h2>

    <div class="section">
      <h3>🏠 Property Details</h3>
      <p><span class="label">Name:</span> <span class="value">${property_name}</span></p>
      <p><span class="label">Type:</span> <span class="value">${property_type}</span></p>
      <p><span class="label">Area:</span> <span class="value">${total_area} sq.ft</span></p>
      <p><span class="label">Address:</span> <span class="value">${address}, ${city}, ${state}</span></p>
      <p><span class="label">Status:</span> <span class="value">${status}</span></p>
    </div>

    <div class="section">
      <h3>👤 Tenant Details</h3>
      <p><span class="label">Name:</span> <span class="value">${tenant.name}</span></p>
      <p><span class="label">Email:</span> <span class="value">${tenant.email}</span></p>
      <p><span class="label">Emergency Contact:</span> <span class="value">${tenant.emer_contact}</span></p>
    </div>

      <a
      href="http://localhost:6876/api/properties/accept_invitation/${property_Id}/${tenantId}/${owner_id}"
      class="btn"
      >
      ✅ Accept Invitation
    </a>


    <div class="footer">
      Please login to your dashboard to approve or reject this request.<br/>
      © Property Management System
    </div>
  </div>

</body>
</html>
      `,
    });

    res.json({ success: true, message: "Invitation request sent to owner" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Email sending failed" });
  }
};

export const acceptInvitation = async (req, res) => {
  try {
    const { tenantId, owner_id, property_Id } = req.params;

    const { data: tenant } = await supabase
      .from("profiles")
      .select("name, email, emer_contact")
      .eq("id", tenantId)
      .single();

    const { data: owner } = await supabase
      .from("profiles")
      .select("name, email")
      .eq("id", owner_id)
      .single();

    const { data: property } = await supabase
      .from("properties")
      .select("*")
      .eq("id", property_Id)
      .single();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.COMPANY_EMAIL,
        pass: process.env.COMPANY_EMAIL_PASS,
      },
    });

    const localLink = `http://localhost:5173/show_prop/${property_Id}`;

    await transporter.sendMail({
      from: `"PROPGROWTHX" <${process.env.COMPANY_EMAIL}>`,
      to: tenant.email,
      subject: `Owner Accepted Your Request for ${property.property_name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial; background:#f4f6f8; padding:20px; }
            .card { max-width:600px; background:#fff; padding:20px; border-radius:8px; margin:auto; box-shadow:0 4px 10px rgba(0,0,0,0.1); }
            h2 { color:#2c3e50; }
            .btn { display:inline-block; margin-top:20px; padding:12px 18px; background:#2ecc71; color:white; text-decoration:none; border-radius:6px; font-weight:bold; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>🎉 Your Request Has Been Accepted!</h2>

            <p><b>Property:</b> ${property.property_name}</p>
            <p><b>Owner:</b> ${owner.name} (${owner.email})</p>
            <p><b>Emergency Contact:</b> ${owner.emer_contact}</p>

            <a href="${localLink}" class="btn">
              ✅ View Property
            </a>

            <p style="margin-top:20px;">© PROPGROWTHX – Property Management System</p>
          </div>
        </body>
        </html>
      `,
    });

    res.send(`
      <center style="margin-top:50px; font-family:Arial;">
        <h1 style="color:green;">✔ Request Accepted Successfully</h1>
        <p>Tenant has been notified by email.</p>
        <p>You can close this window now.</p>
      </center>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// import QRCode from "qrcode";

export const requestForInvitationByQrCode = async (req, res) => {
  console.log("here we are");

  try {
    const { property_name, tenantId, owner_id, property_id } = req.body;

    const { data: tenant } = await supabase
      .from("profiles")
      .select("name, email, emer_contact")
      .eq("id", tenantId)
      .single();

    const { data: owner } = await supabase
      .from("profiles")
      .select("name, email")
      .eq("id", owner_id)
      .single();

    const propertyUrl = `https:// vercel lick should be here/show-property/${property_id}`;
    const qrCodeDataUrl = await QRCode.toDataURL(propertyUrl);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.COMPANY_EMAIL,
        pass: process.env.COMPANY_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"PROPGROWTHX" <${process.env.COMPANY_EMAIL}>`,
      to: tenant.email,
      subject: `You can view property: ${property_name}`,
      html: `
        <h2>Hello ${tenant.name}</h2>
        <p>You are invited to view property: <b>${property_name}</b></p>
        <p>Scan the QR code below to visit the property page:</p>
        <img src="${qrCodeDataUrl}" alt="Property QR Code" style="width:200px;height:200px;" />
        <p>Or click here: <a href="${propertyUrl}">${propertyUrl}</a></p>
        <p>© PROPGROWTHX – Property Management System</p>
      `,
    });
    res.send(`
      <center style="margin-top:50px; font-family:Arial;">
        <h1 style="color:green;">✔ Request Accepted Successfully</h1>
        <p>Tenant has been notified by email.</p>
        <p>You can close this window now.</p>
      </center>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send QR code email" });
  }
};
