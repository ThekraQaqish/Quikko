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




//to get the profile of the company

async function getCompanyProfile(req, res) {
  const companyId = parseInt(req.params.id, 10);

  if (Number.isNaN(companyId) || companyId <= 0) {
    return res.status(400).json({ error: "Invalid company id" });
  }

  try {
    const profile = await Delivery.getProfileByCompanyId(companyId);

    if (!profile) {
      return res.status(404).json({ error: "Company not found" });
    }

    return res.status(200).json({ company: profile });
  } catch (err) {
    console.error("Error fetching company profile:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


//edit the profile of the company 
async function updateCompanyProfile(req, res) {
  const companyId = parseInt(req.params.id, 10);
  if (Number.isNaN(companyId) || companyId <= 0) {
    return res.status(400).json({ error: "Invalid company id" });
  }

  const { company_name, coverage_areas } = req.body;

  try {
    const updated = await Delivery.updateProfileByCompanyId(companyId, {
      company_name,
      coverage_areas,
    });

    if (!updated) {
      return res.status(404).json({ error: "Company not found" });
    }

    return res.status(200).json({ company: updated });
  } catch (err) {
    console.error("Error updating company profile:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

//get all orders for the company by its id
async function listCompanyOrders(req, res) {
  const companyId = parseInt(req.params.companyId, 10);

  if (Number.isNaN(companyId) || companyId <= 0) {
    return res.status(400).json({ error: "Invalid company id" });
  }

  try {
    const orders = await Delivery.getOrdersByCompanyId(companyId);
    return res.status(200).json({ orders });
  } catch (err) {
    console.error("Error fetching orders:", err);
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

async function addCoverage(req, res) {
  const companyId = parseInt(req.params.companyId, 10);
  if (Number.isNaN(companyId) || companyId <= 0) {
    return res.status(400).json({ error: "Invalid company id" });
  }

  const areas  = req.body.coverage_areas; // JSON body: { "areas": ["Amman", "Irbid"] }
  if (!Array.isArray(areas) || areas.length === 0) {
    return res.status(400).json({ error: "areas must be a non-empty array" });
  }

  try {
    const updatedCompany = await Delivery.addCoverageByCompanyId(
      companyId,
      areas
    );

    if (!updatedCompany) {
      return res.status(404).json({ error: "Company not found" });
    }

    return res.status(200).json({ company: updatedCompany });
  } catch (err) {
    console.error("Error updating coverage areas:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  updateStatus,
  getTrackingInfo,
  getCoverageById,
  getCompanyProfile,
  updateCompanyProfile,
  listCompanyOrders,
  addCoverage,
};
