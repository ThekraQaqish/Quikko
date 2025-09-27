import axios from "axios";

const API_URL = "http://localhost:3000/api/customers";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // إذا كنت تستخدم الكوكيز مع السيرفر
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || localStorage.getItem("guest_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const customerAPI = {
  // Profile
  getProfile: async () => (await api.get("/profile")).data,
  updateProfile: async (data) => (await api.put("/profile", data)).data,

  // Carts
  getCart: async () => (await api.get("/cart")).data,
  getCartById: async (id) => (await api.get(`/cart/${id}`)).data,
  createCart: async () => (await api.post("/cart")).data,
  createCartForUser: async (userId) => {
  if (userId) {
    return (await api.post("/cart", { user_id: userId })).data;
  }
  return (await api.post("/cart")).data; 
},

  updateCart: async (id, data) => (await api.put(`/cart/${id}`, data)).data,
  deleteCart: async (id) => (await api.delete(`/cart/${id}`)).data,

  // Cart Items
  addItem: async ({ cartId, product, quantity, variant }) => {
    const res = await api.post("/cart/items", {
      cart_id: cartId,
      product_id: product.id,
      quantity,
      variant,
    });
    return res.data;
  },
  updateItem: async (id, data) => (await api.put(`/cart/items/${id}`, data)).data,
  deleteItem: async ({ cartId, itemId }) => {
    const res = await api.delete(`/cart/items/${itemId}`);
    return res.data;
  },

  // Orders
  getOrders: async () => (await api.get("/orders")).data,
  getOrderById: async (id) => (await api.get(`/orders/${id}`)).data,
  trackOrder: async (id) => (await api.get(`/orders/${id}/track`)).data,

  // Products
  getProducts: async (params = {}) => (await api.get("/products", { params })).data,
  getCategories: async () =>{
  const res = (await axios.get("http://localhost:3000/api/categories")).data;
  return res.data;
  },

  // Stores
  getStores: async () => {
    const res = await api.get("http://localhost:3000/api/vendor/stores");
    return res.data.data.filter(store => store.status === "approved"); // خذ array من data ثم فلتر
  },

  getStoreById: async (id) => {
    const res = await api.get(`/stores/${id}`); // لاحظ تعديل الراوت إذا يلزم
    return res.data.data; // متجر واحد
  },

    getStoreProducts: async (storeId) => {
    const res = await api.get(`/stores/${storeId}/products`);
    return res.data.data; // نرجع مباشرة array المنتجات
  },

  // Checkout
    checkout: async (data) => {
    const res = await api.post("/checkout", data);
    return res.data; // { order: { id, items, address, payment_method, ... } }
    },
getOrCreateCart: async () => {
  try {
    const res = await api.get("/cart"); // هذا يعيد array
    const carts = res.data; 
    const cart = carts[0]; // أو طبق فلتر حسب user_id
    if (cart) return cart;

    // إذا لم يوجد كارت، أنشئ واحد جديد
    const newCart = await api.post("/cart");
    return newCart.data;
  } catch (err) {
    console.log(err);
    const newCart = await api.post("/cart");
    return newCart.data;
  }
},
};


export default customerAPI;
