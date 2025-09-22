const DeliveryService = require("./deliveryService");

/**
 * ====================================
 * Delivery Controller
 * Handles delivery company & orders
 * ====================================
 */

/**
 * Get company profile for authenticated user
 * @async
 * @function
 * @param {Object} req - Express request object (requires auth middleware)
 * @param {Object} req.user - Authenticated user info
 * @param {number} req.user.id - User ID from token
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with company profile
 */
exports.getCompanyProfile = async function (req, res) {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const profile = await DeliveryService.getCompanyProfile(userId);
    if (!profile)
      return res.status(404).json({ error: "Company not found for this user" });

    return res.status(200).json({ company: profile });
  } catch (err) {
    console.error("Error fetching company profile:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Update company profile for authenticated user
 * @async
 * @function
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user info
 * @param {number} req.user.id - User ID from token
 * @param {Object} req.body - Profile update payload
 * @param {string} req.body.company_name - New company name
 * @param {Array<string>} req.body.coverage_areas - Updated coverage areas
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with updated company profile
 */
exports.updateCompanyProfile = async function (req, res) {
  const userId = req.user.id;
  const { company_name, coverage_areas } = req.body;

  try {
    const updated = await Delivery.updateCompanyProfile(userId, {
      company_name,
      coverage_areas,
    });

    if (!updated)
      return res.status(404).json({ error: "Company not found for this user" });

    return res.status(200).json({ company: updated });
  } catch (err) {
    console.error("Error updating company profile:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Allowed order statuses for delivery updates
 * @constant {Array<string>}
 */
const ALLOWED_STATUSES = [
  "pending",
  "processing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

/**
 * Update the status of an order for a delivery company
 * @async
 * @function
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user info
 * @param {number} req.user.id - User ID from token
 * @param {Object} req.body - Status payload
 * @param {string} req.body.status - New order status
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with updated order
 */
exports.updateOrderStatus = async function (req, res) {
  try {
    const orderId = parseInt(req.params.id, 10);
    const { status } = req.body;
    const userId = req.user.id;

    if (Number.isNaN(orderId) || orderId <= 0)
      return res.status(400).json({ error: "Invalid order id" });

    if (!status || typeof status !== "string")
      return res
        .status(400)
        .json({ error: "status is required in request body" });

    if (!ALLOWED_STATUSES.includes(status))
      return res
        .status(400)
        .json({ error: "Invalid status", allowed_statuses: ALLOWED_STATUSES });

    const company = await Delivery.getCompanyProfile(userId);
    if (!company)
      return res
        .status(403)
        .json({ error: "User is not associated with any delivery company" });

    const order = await Delivery.getOrderDetails(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.company_id !== company.company_id)
      return res
        .status(403)
        .json({ error: "This company is not authorized to update this order" });

    const updated = await Delivery.updateOrderStatus(orderId, status);

    return res
      .status(200)
      .json({ message: "Order status updated", order: updated });
  } catch (err) {
    console.error("Error updating order status:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get tracking information for an order
 * @async
 * @function
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user info
 * @param {number} req.user.id - User ID from token
 * @param {string} req.user.role - User role (customer, delivery, admin)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with order tracking info
 */
exports.getTrackingInfo = async function (req, res) {
  try {
    const orderId = parseInt(req.params.orderId, 10);
    const userId = req.user.id;
    const userRole = req.user.role;

    if (Number.isNaN(orderId) || orderId <= 0)
      return res.status(400).json({ error: "Invalid order id" });

    const order = await Delivery.getOrderDetails(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (userRole === "delivery") {
      const company = await Delivery.getCompanyProfile(userId);
      if (!company || company.company_id !== order.delivery_company_id)
        return res
          .status(403)
          .json({ error: "Not authorized to view this order" });
    } else if (userRole === "customer") {
      if (order.customer_id !== userId)
        return res
          .status(403)
          .json({ error: "Not authorized to view this order" });
    }

    return res.status(200).json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * List all orders for a delivery company
 * @async
 * @function
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user info
 * @param {number} req.user.id - User ID from token
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with orders array
 */
exports.listCompanyOrders = async function (req, res) {
  try {
    let companyId;

    if (req.params.companyId) {
      companyId = parseInt(req.params.companyId, 10);
    } else {
      const company = await Delivery.getCompanyProfile(req.user.id);
      companyId = company?.company_id;
    }

    if (!companyId || Number.isNaN(companyId))
      return res.status(400).json({ error: "Invalid company id" });

    const orders = await Delivery.getCompanyOrders(companyId);
    return res.status(200).json({ orders });
  } catch (err) {
    console.error("Error fetching company orders:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Display coverage areas for a delivery company
 * @async
 * @function
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user info
 * @param {number} req.user.id - User ID from token
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with coverage areas
 */
exports.getCoverage = async function (req, res) {
  try {
    const userId = req.user.id;
    const company = await Delivery.getCoverageAreas(userId);

    if (!company)
      return res
        .status(403)
        .json({ error: "This user is not a delivery company" });

    return res.status(200).json(company);
  } catch (err) {
    console.error("Error fetching coverage area:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Add new coverage areas for a delivery company
 * @async
 * @function
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user info
 * @param {number} req.user.id - User ID from token
 * @param {Object} req.body - Request body { areas: ["city1", "city2"] }
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with updated coverage
 */
exports.addCoverage = async (req, res) => {
  const userId = req.user.id;
  const { areas } = req.body;

  if (!Array.isArray(areas) || areas.length === 0)
    return res.status(400).json({ error: "areas must be a non-empty array" });

  try {
    const updatedCompany = await DeliveryService.addCoverageAreas(userId, areas);
    if (!updatedCompany)
      return res.status(403).json({ error: "This user is not a delivery company" });

    return res.status(200).json({ company: updatedCompany });
  } catch (err) {
    console.error("Error updating coverage areas:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Update a specific coverage area
 * @async
 * @function
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user info
 * @param {number} req.user.id - User ID from token
 * @param {Object} req.params - Request params { id: coverageAreaId }
 * @param {Object} req.body - Request body with updated data
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with updated coverage
 */
exports.updateCoverage = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const updatedCoverage = await DeliveryService.updateCoverageArea(id, user_id, req.body);

    if (!updatedCoverage)
      return res.status(404).json({ message: "coverage area not found" });

    res.json({
      message: "coverage area updated successfully",
      data: updatedCoverage,
    });
  } catch (err) {
    console.error("Update coverage area error:", err);
    res.status(500).json({ message: "Error updating coverage area" });
  }
};

/**
 * Delete a specific coverage area
 * @async
 * @function
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user info
 * @param {number} req.user.id - User ID from token
 * @param {Object} req.params - Request params { id: coverageAreaId }
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response
 */
exports.deleteCoverage = async (req, res) => {
  try {
    const userId = req.user.id;
    const areas = req.body?.areas;

    if (!Array.isArray(areas) || areas.length === 0)
      return res.status(400).json({ error: "areas must be a non-empty array" });

    const updatedCompany = await DeliveryService.deleteCoverageArea(userId, areas);
    if (!updatedCompany)
      return res.status(404).json({ message: "coverage area not found" });

    res.json({
      message: "coverage areas deleted successfully",
      data: updatedCompany,
    });
  } catch (err) {
    console.error("Delete coverage area error:", err);
    res.status(500).json({ message: "Error deleting coverage areas" });
  }
};

