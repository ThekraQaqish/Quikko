// src/modules/admin/adminController.js
const pool = require('../../config/db');
const Admin = require("./adminModel");

exports.getPendingVendors = async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM vendors WHERE status='pending'`);
  res.json(rows);
};

exports.approveVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const vendorIdInt = parseInt(req.params.vendorId, 10);
    if (isNaN(vendorIdInt)) {
    return res.status(400).json({ error: 'Invalid vendorId' });
    }

    console.log('Approving vendorId:', req.params.vendorId);

    const { rows } = await pool.query(
      `UPDATE vendors 
       SET status='approved', updated_at=NOW() 
       WHERE user_id=$1 
       RETURNING *`,
      [vendorIdInt]
    );
    console.log('Rows returned:', rows);


    if (!rows[0]) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    res.json({ message: 'Vendor approved successfully', data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.rejectVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { rows } = await pool.query(
      `UPDATE vendors SET status='rejected', updated_at=NOW() WHERE user_id=$1 RETURNING *`,
      [vendorId]
    );

    if (!rows[0]) return res.status(404).json({ error: 'Vendor not found' });

    res.json({ message: 'Vendor rejected successfully', data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};



// نفس الفكرة للـ delivery_companies
exports.getPendingDeliveries = async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM delivery_companies WHERE status='pending'`);
  res.json(rows);
};
exports.approveDelivery = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { rows } = await pool.query(
      `UPDATE delivery_companies SET status='approved', updated_at=NOW() WHERE user_id=$1 RETURNING *`,
      [deliveryId]
    );

    if (!rows[0]) return res.status(404).json({ error: 'Delivery company not found' });

    res.json({ message: 'Delivery company approved successfully', data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.rejectDelivery = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { rows } = await pool.query(
      `UPDATE delivery_companies SET status='rejected', updated_at=NOW() WHERE user_id=$1 RETURNING *`,
      [deliveryId]
    );

    if (!rows[0]) return res.status(404).json({ error: 'Delivery company not found' });

    res.json({ message: 'Delivery company rejected successfully', data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.listAllCompanies = async (req, res) => {
  try {
    const companies = await Admin.getAllDeliveryCompanies();
    if (!companies || companies.length === 0) {
      return res.status(404).json({ error: "No delivery companies found" });
    }
    res.status(200).json({ companies });
  } catch (err) {
    console.error("Error fetching delivery companies (Admin):", err);
    res.status(500).json({ error: "Server error" });
  }
};
