const Delivery = require("./deliveryModel");

exports.getCompanyProfile = async function (req, res) {
  try {
    const userId = req.user.id; // جاي من التوكن (authMiddleware)

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const profile = await Delivery.getProfileByUserId(userId);

    if (!profile) {
      return res.status(404).json({ error: "Company not found for this user" });
    }

    return res.status(200).json({ company: profile });
  } catch (err) {
    console.error("Error fetching company profile:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//edit the profile of the company
exports.updateCompanyProfile = async function (req, res) {
  const userId = req.user.id; // جاي من التوكن بالـ authMiddleware
  const { company_name, coverage_areas } = req.body;

  try {
    const updated = await Delivery.updateProfileByUserId(userId, {
      company_name,
      coverage_areas,
    });

    if (!updated) {
      return res.status(404).json({ error: "Company not found for this user" });
    }

    return res.status(200).json({ company: updated });
  } catch (err) {
    console.error("Error updating company profile:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const ALLOWED_STATUSES = [
  "pending",
  "processing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

async function updateStatus(req, res) {
  const id = parseInt(req.params.id, 10);
  const { status, company_id } = req.body;

  if (Number.isNaN(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid order id" });
  }
exports.updateOrderStatus = async function (req, res) {
  try {
    const orderId = parseInt(req.params.id, 10);
    const { status } = req.body;
    const userId = req.user.id; // جاي من التوكن

    if (Number.isNaN(orderId) || orderId <= 0) {
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

    // جلب الشركة التابعة للـ user
    const company = await Delivery.getProfileByUserId(userId);
    if (!company) {
      return res
        .status(403)
        .json({ error: "User is not associated with any delivery company" });
    }

    // جلب الأوردر
    const order = await Delivery.getOrderWithCompany(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // تحقق إذا الأوردر تابع للشركة
    if (order.company_id !== company.company_id) {
      return res.status(403).json({
        error: "This company is not authorized to update this order",
      });
    }

    // تحديث الحالة
    const updated = await Delivery.updateStatus(orderId, status);

    return res.status(200).json({
      message: "Order status updated",
      order: updated,
    });
  } catch (err) {
    console.error("Error updating order status:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getTrackingInfo(req, res) {
  const orderId = parseInt(req.params.orderId, 10);
};

//get the tracking info from orders table
exports.getTrackingInfo = async function (req, res) {
  try {
    const orderId = parseInt(req.params.orderId, 10);
    const userId = req.user.id; // مستخرج من التوكن
    const userRole = req.user.role;

    if (Number.isNaN(orderId) || orderId <= 0) {
      return res.status(400).json({ error: "Invalid order id" });
    }

    const order = await Delivery.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // تحقق صلاحية الوصول
    if (userRole === "delivery") {
      const company = await Delivery.getCompanyByUserId(userId);
      if (!company || company.company_id !== order.delivery_company_id) {
        return res
          .status(403)
          .json({ error: "Not authorized to view this order" });
      }
    } else if (userRole === "customer") {
      if (order.customer_id !== userId) {
        return res
          .status(403)
          .json({ error: "Not authorized to view this order" });
      }
    }

    // Admin يمكنه الوصول لكل الأوردرات
    return res.status(200).json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// //get all orders for the company by its id
exports.listCompanyOrders = async function (req, res) {
  const userId = req.user.id; // ID المستخرج من التوكن

  try {
    const companyId = await Delivery.getCompany(userId);

    if (!companyId) {
      return res
        .status(403)
        .json({ error: "This user is not a delivery company" });
    }

    const orders = await Delivery.getOrdersByCompanyId(companyId);
    return res.status(200).json({ orders });
  } catch (err) {
    console.error("Error fetching company orders:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//dislay the coverage area for specific company
exports.getCoverage = async function (req, res) {
  const userId = req.user.id; // جاي من التوكن بعد ما تتحقق الـ auth

  try {
    const company = await Delivery.getCoverageById(userId);
    if (!company) {
      return res
        .status(403)
        .json({ error: "This user is not a delivery company" });
    }

    return res.status(200).json(company);
  } catch (err) {
    console.error("Error fetching coverage area:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

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

async function addOrUpdateCoverage(req, res) {
  const companyId = parseInt(req.params.companyId, 10);
  if (Number.isNaN(companyId) || companyId <= 0) {
    return res.status(400).json({ error: "Invalid company id" });
  }

  const { areas } = req.body; 
};

exports.addCoverage = async function (req, res) {
  const userId = req.user.id; // من التوكن بعد الـ auth middleware
  const { areas } = req.body; // JSON body: { "areas": ["Amman", "Irbid"] }

  if (!Array.isArray(areas) || areas.length === 0) {
    return res.status(400).json({ error: "areas must be a non-empty array" });
  }

  try {
    const updatedCompany = await Delivery.addCoverage(userId, areas);

    if (!updatedCompany) {
      return res
        .status(403)
        .json({ error: "This user is not a delivery company" });
    }

    return res.status(200).json({ company: updatedCompany });
  } catch (err) {
    console.error("Error updating coverage areas:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// Update coverage area
exports.updateCoverage = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const updatedCoverage = await Delivery.updateCoverage(id, user_id, req.body);

    if (!updatedCoverage) return res.status(404).json({ message: "coverage area not found" });

    res.json({ message: "coverage area updated successfully", data: updatedCoverage });
  } catch (err) {
    console.error("Update coverage area error:", err);
    res.status(500).json({ message: "Error updating coverage area" });
  }
};

// Delete coverage area
exports.deleteCoverage = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const deletedRow  = await Delivery.deleteCoverage(id, user_id);

    if (!deletedRow) return res.status(404).json({ message: "coverage area not found" });
    
    res.json({ message: "coverage area deleted successfully" });
  } catch (err) {
    console.error("Delete coverage area error:", err);
    res.status(500).json({ message: "Error deleting coverage area" });
  }
};