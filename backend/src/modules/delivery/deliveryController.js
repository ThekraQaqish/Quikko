const Delivery = require("./deliveryModel");

//this for updateStatus
const ALLOWED_STATUSES = [
  "pending",
  "processing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

//the company can only edit the status of all orders assign to it 
async function updateStatus(req, res) {
  const id = parseInt(req.params.id, 10);
  const { status, company_id } = req.body; 

  if (Number.isNaN(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid order id" });
  }

  if (!status || typeof status !== "string") {
    return res
      .status(400)
      .json({ error: "status is required in request body" });
  }

  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({
      error: "Invalid status",
      allowed_statuses: ALLOWED_STATUSES,
    });
  }

  if (!company_id) {
    return res
      .status(400)
      .json({ error: "company_id is required in request body" });
  }

  try {
    const order = await Delivery.getOrderWithCompany(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.company_id !== company_id) {
      return res.status(403).json({
        error: "This company is not authorized to update this order",
      });
    }

    const updated = await Delivery.updateStatus(id, status);

    return res.status(200).json({
      message: "Order status updated",
      order: updated,
    });
  } catch (err) {
    console.error("Error updating order status:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

//get the tracking info from orders table
async function getTrackingInfo(req, res) {
  const orderId = parseInt(req.params.orderId, 10);

  if (Number.isNaN(orderId) || orderId <= 0) {
    return res.status(400).json({ error: "Invalid order id" });
  }

  try {
    const order = await Delivery.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


//dislay the coverage area for specific company
async function getCoverageById(req, res) {
  const companyId = parseInt(req.params.companyId, 10);

  if (Number.isNaN(companyId) || companyId <= 0) {
    return res.status(400).json({ error: "Invalid company id" });
  }

  try {
    const company = await Delivery.getCoverageById(companyId);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    return res.status(200).json(company);
  } catch (err) {
    console.error("Error fetching coverage area:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

//to get the profile of the company
async function getProfile(req, res) {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }

  try {
    const profile = await Delivery.getProfileByUserId(Number(user_id));
    if (!profile) {
      return res.status(404).json({ error: "Company not found" });
    }

    return res.status(200).json(profile);
  } catch (err) {
    console.error("Error fetching profile:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

//get the profile of the company 
async function updateProfile(req, res) {
  const { user_id, company_name, coverage_areas } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }

  try {
    const existing = await Delivery.getProfileByUserId(Number(user_id));
    if (!existing) {
      return res.status(404).json({ error: "Company not found" });
    }

    const updated = await Delivery.updateProfile(
      existing.company_id,
      Number(user_id),
      {
        company_name,
        coverage_areas,
      }
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      company: updated,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


module.exports = {
  updateStatus,
  getTrackingInfo,
  getCoverageById,
  getProfile,
  updateProfile,
};
