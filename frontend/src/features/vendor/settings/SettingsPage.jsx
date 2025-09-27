import React, { useEffect, useState } from "react";
import {
  fetchVendorProfile,
  updateVendorProfile,
  fetchCategories,
} from "../VendorAPI";

const SettingsPage = () => {
  const [profile, setProfile] = useState({
    store_name: "",
    store_slug: "",
    description: "",
    address: "",
    image: "",
    category_id: "",
  });
  const [categories, setCategories] = useState([]);
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(true);

  // توليد slug من اسم المتجر
  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  };

  useEffect(() => {
    const loadProfile = async () => {
      const data = await fetchVendorProfile();
      if (data) {
        setProfile({
          store_name: data.store_name || "",
          store_slug: data.store_slug || "",
          description: data.description || "",
          address: data.address || "",
          image: data.image || "",
          category_id: data.category_id || "",
        });
      }
      setLoading(false);
    };

    const loadCategories = async () => {
      const cats = await fetchCategories();
      setCategories(cats || []);
    };

    loadProfile();
    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfile((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    // نرسل فقط الحقول التي غيّرها المستخدم
    const updatedData = {};
    Object.keys(profile).forEach((key) => {
      if (profile[key] !== "" && profile[key] !== null && profile[key] !== undefined) {
        updatedData[key] = profile[key];
      }
    });

    // التأكد من store_name و store_slug
    if (!updatedData.store_name)
      updatedData.store_name = profile.store_name || "Unnamed Store";
    if (!updatedData.store_slug)
      updatedData.store_slug = profile.store_slug || slugify(updatedData.store_name);

    try {
      const updated = await updateVendorProfile(updatedData);
      if (updated) {
        alert("✅ Profile updated successfully!");
        // دمج التحديث مع البيانات القديمة بدل استبدالها بالكامل
        setProfile((prev) => ({ ...prev, ...updated }));
      } else {
        alert("❌ Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("⚠️ Something went wrong while updating the profile.");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Store Settings</h1>

      {/* صورة المتجر */}
      <div className="flex items-center space-x-4">
        <img
          src={profile.image || "/placeholder.png"}
          alt="Store"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      {/* اسم المتجر */}
      <div>
        <label className="block font-semibold mb-1">Store Name</label>
        <input
          type="text"
          name="store_name"
          value={profile.store_name}
          onChange={handleChange}
          placeholder="Enter store name"
          className="border p-2 rounded w-full text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* الوصف */}
      <div>
        <label className="block font-semibold mb-1">Description</label>
        <textarea
          name="description"
          value={profile.description}
          onChange={handleChange}
          placeholder="Enter store description"
          className="border p-2 rounded w-full text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* الموقع */}
      <div>
        <label className="block font-semibold mb-1">Location</label>
        <input
          type="text"
          name="address"
          value={profile.address}
          onChange={handleChange}
          placeholder="Enter location"
          className="border p-2 rounded w-full text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* الفئة */}
      <div>
        <label className="block font-semibold mb-1">Category</label>
        <select
          name="category_id"
          value={profile.category_id}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Theme & Notifications */}
      <div className="flex items-center space-x-6">
        <div>
          <label className="font-semibold mr-2">Theme</label>
          <button
            className="px-3 py-1 border rounded"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme}
          </button>
        </div>

        <div>
          <label className="font-semibold mr-2">Notifications</label>
          <button
            className={`px-3 py-1 border rounded ${
              notifications ? "bg-green-200" : ""
            }`}
            onClick={() => setNotifications(!notifications)}
          >
            {notifications ? "On" : "Off"}
          </button>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Save Changes
      </button>
    </div>
  );
};

export default SettingsPage;
