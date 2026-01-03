import { supabase } from "../config/supabase.js";

export const getPayments = async (req, res) => {
  const { data, error } = await supabase.from("payments").select("*");

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json(data);
};
export const getPaymentsById = async (req, res) => {
  const { id } = req.params; // user_id

  try {
    const { data, error } = await supabase
      .from("payments")
      .select(
        `
        id,
        property_name,
        amount,
        payment_date,
        payment_mode,
        status
      `
      )
      .eq("user_id", id)
      .order("payment_date", { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      payments: data,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

export const createPayment = async (req, res) => {
  const { property_id, amount, payment_mode, buyer_id } = req.body;

  const payment_date = new Date().toISOString();

  try {
    const { data: buyer, error: buyerError } = await supabase
      .from("profiles")
      .select("id, name")
      .eq("id", buyer_id)
      .single();

    if (buyerError) throw buyerError;

    const { data: property, error: propError } = await supabase
      .from("properties")
      .select("id, property_name, owner_id")
      .eq("id", property_id)
      .single();

    if (propError) throw propError;

    const { data: owner, error: ownerError } = await supabase
      .from("profiles")
      .select("id, name")
      .eq("id", property.owner_id)
      .single();

    if (ownerError) throw ownerError;

    const { data, error } = await supabase
      .from("payments")
      .insert([
        {
          user_id: buyer.id,
          user_name: owner.name,
          property_id: property.id,
          property_name: property.property_name,
          amount,
          payment_date,
          payment_mode,
          status: "debited",
        },
        {
          user_id: owner.id,
          property_id: property.id,
          user_name: buyer.name,
          property_name: property.property_name,
          amount,
          payment_date,
          payment_mode,
          status: "credited",
        },
      ])
      .select();

    if (error) throw error;

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
