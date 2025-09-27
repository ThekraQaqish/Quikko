

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// 🔹 جلب جميع المنتجات
export const fetchProducts = async () => {
  const res = await fetch("/api/vendor/products", {
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  console.log("🔹 API Response (products):", json);
  return json.data || [];
};

// 🔹 إضافة منتج جديد
export const addProduct = async (product) => {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(product),
  });
  const json = await res.json();
  console.log("🔹 Product Added Response:", json);
  return json;
};

// 🔹 تعديل منتج موجود
export const updateProduct = async (id, product) => {
  const res = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(product),
  });
  const json = await res.json();
  console.log("🔹 Product Updated Response:", json);
  return json;
};

// 🔹 حذف منتج
export const deleteProduct = async (id) => {
  const res = await fetch(`/api/products/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  console.log("🔹 Product Deleted:", id, "Status:", res.status);
};

// 🔹 جلب كل الفئات
export const fetchCategories = async () => {
  const res = await fetch("/api/categories", {
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  console.log("🔹 API Response (categories):", json);
  return json.data || json;
};

// 🔹 تسجيل Vendor جديد
export const registerVendorAPI = async (vendorData) => {
  const res = await fetch("/api/auth/register/vendor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vendorData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to register vendor");
  }

  return data;
};

// 🔹 جلب كل الأوردرات للـ Vendor
export const fetchOrders = async (status = "") => {
  const query = status ? `?status=${status}` : "";
  const res = await fetch(`/api/vendor/orders${query}`, {
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  console.log("🔹 API Response (orders):", json);
  return json.data || [];
};

// 🔹 تحديث حالة الأوردر
export const updateOrderStatus = async (id, status) => {
  const res = await fetch(`/api/vendor/orders/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  const json = await res.json();
  console.log("🔹 Order Status Updated:", json);
  return json;
};
// 🔹 جلب تقرير البائع (Vendor Report)
export const fetchVendorReport = async () => {
  const res = await fetch("/api/vendor/reports", {
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  console.log("🔹 API Response (vendor report):", json);
  return json.data || {};
};

// 🔹 
const fetchLastOrders = async () => {
  const data = await fetchOrders();

  // Group by order_id
  const uniqueOrders = Object.values(
    data.reduce((acc, order) => {
      acc[order.order_id] = order; 
      return acc;
    }, {})
  );

  
  setOrders(uniqueOrders.slice(0, 5));
};

// vendorAPI.js
const API_URL = "/api"; // حسب الباكيند عندك

// ✅ جلب كل المحادثات الخاصة بالمستخدم الحالي
export const fetchConversations = async () => {
  try {
    const res = await fetch(`${API_URL}/chat/conversations`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch conversations");
    return await res.json();
  } catch (err) {
    console.error("Error fetching conversations:", err);
    return [];
  }
};

// ✅ جلب الرسائل مع مستخدم محدد
export const fetchMessages = async (user2) => {
  try {
    const user1 = localStorage.getItem("userId");
    const res = await fetch(`${API_URL}/chat?user1=${user1}&user2=${user2}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch messages");
    return await res.json();
  } catch (err) {
    console.error("Error fetching messages:", err);
    return [];
  }
};

// ✅ إرسال رسالة
export const sendMessage = async (receiverId, message) => {
  try {
    const res = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        receiver_id: receiverId,
        message,
      }),
    });

    if (!res.ok) throw new Error("Failed to send message");
    return await res.json();
  } catch (err) {
    console.error("Error sending message:", err);
    return null;
  }
};
// 🔹 جلب بيانات البروفايل للـ Vendor
export const fetchVendorProfile = async () => {
  try {
    const res = await fetch("/api/vendor/profile", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch profile");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching vendor profile:", err);
    return null;
  }
};

// 🔹 تحديث بيانات البروفايل
export const updateVendorProfile = async (profileData) => {
  try {
    const res = await fetch("/api/vendor/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(profileData),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error updating vendor profile:", err);
    return null;
  }
};
