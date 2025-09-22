module.exports = async (req, res, next) => {
  try {
    if (req.customerId) {
      // مستخدم مسجل
      req.isGuest = false;
    } else if (req.guestToken) {
      // مستخدم ضيف
      req.isGuest = true;
    } else {
      return res.status(500).json({ message: "معرف العميل مفقود" });
    }
    next();
  } catch (err) {
    console.error("IdentifyCustomer middleware error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

