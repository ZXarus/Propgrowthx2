import { supabase } from "../config/supabase.js";

export const getPayments = async (req, res) => {
  const { data, error } = await supabase.from("payments").select("*");

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json(data);
};
export const getPaymentsById = async (req, res) => {
  const id = req.user.id;
  const { role } = req.params;

  const userColumn = role === "owner" ? "owner_id" : "tenant_id";

  try {
    const { data, error } = await supabase
      .from("payments")
      .select(
        `
        *,
        properties (
          due_date,
          end_date
        )
      `,
      )
      .eq(userColumn, id);

    if (error) {
      return res.status(400).json({ error });
    }

    res.status(200).json({ pay: data || [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

export const createPayment = async (req, res) => {
  const { property_id, amount, payment_mode, buyer_id } = req.body;

  try {
    const { data: buyer, error: buyerError } = await supabase
      .from("profiles")
      .select("id, name")
      .eq("id", buyer_id)
      .single();

    console.log(buyer);

    if (buyerError) {
      console.log(buyerError);

      throw buyerError;
    }

    const { data: property, error: propError } = await supabase
      .from("properties")
      .select("id, property_name,owner_id,listing_type")
      .eq("id", property_id)
      .single();

    console.log(property);

    if (propError) {
      console.log(propError);

      throw propError;
    }

    const { data: owner, error: ownerError } = await supabase
      .from("profiles")
      .select("id,name")
      .eq("id", property.owner_id)
      .single();
    console.log(owner);

    //  tetant all data and owner ra all data

    if (ownerError) {
      console.log(ownerError);

      throw ownerError;
    }

    //  here decide it is complete or over due
    let status = "completed";

    const { data, error } = await supabase
      .from("payments")
      .insert([
        {
          tenant_id: buyer.id,
          tenant_name: buyer.name,
          property_id: property.id,
          owner_id: owner.id,
          owner_name: owner.name,
          property_name: property.property_name,
          amount,
          payment_mode,
          status: status,
          type: property.listing_type,
        },
      ])
      .select();

    if (error) {
      console.log(error);

      throw error;
    }

    return res.status(201).json({
      message: "Payment successful",
      buyer: buyer.name,
      owner: owner.name,
      amount,
      data,
    });
  } catch (err) {
    return res.status(400).json({
      error: err.message || "Payment failed",
    });
  }
};

export const updatePayment = async (req, res) => {
  const { id } = req.params;
  const { amount, payment_date, status, payment_mode, reference_no } = req.body;

  //  here i will make sure that the  client will not pay overdue if less payment i can add some fine on that (it is optional)

  const { data, error } = await supabase
    .from("payments")
    .update({
      amount,
      payment_date,
      status,
      payment_mode,
      reference_no,
    })
    .eq("id", id)
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({
    message: "Payment updated successfully",
    data,
  });
};
