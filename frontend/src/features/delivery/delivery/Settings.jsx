/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  fetchDeliveryProfile,
  updateDeliveryProfile,
  fetchCoverageAreas,
} from "./DeliveryAPI";

export default function EditProfile() {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [originalData, setOriginalData] = useState({});
  const [darkModeOn, setDarkModeOn] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const ALLOWED_AREAS = [
    "Amman",
    "Zarqa",
    "Irbid",
    "Ajloun",
    "Jerash",
    "Mafraq",
    "Madaba",
    "Karak",
    "Tafilah",
    "Ma'an",
    "Aqaba",
  ];

  // ✅ جلب البيانات من الـ backend
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await fetchDeliveryProfile(token);

        // خذ الـ coverage من الـ location إذا موجود، وإلا من الـ API
        const coverageFromState = location.state?.coverageAreas || [];
        const areas = await fetchCoverageAreas(token);

        const initData = {
          company_name: data.company_name || "",
          coverage_areas:
            coverageFromState.length > 0
              ? coverageFromState
              : data.coverage_areas || [],
          user_name: data.user_name || "",
          user_phone: data.user_phone || "",
        };

        setFormData(initData);
        setOriginalData(initData);
      } catch (err) {
        setMessage("❌ " + err.message);
      }
    };

    loadProfile();
  }, [location.state?.coverageAreas]); // ✅ حطيناها في dependencies

  if (!formData) return <p className="text-center mt-10">Loading...</p>;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ تحديد الحقول التي تغيّرت فقط
  const getChangedFields = () => {
    const changed = {};
    Object.keys(formData).forEach((key) => {
      if (key === "coverage_areas") {
        if (
          JSON.stringify(formData[key].sort()) !==
          JSON.stringify((originalData[key] || []).sort())
        ) {
          changed[key] = formData[key];
        }
      } else if (formData[key] !== originalData[key]) {
        changed[key] = formData[key];
      }
    });
    return changed;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const payload = getChangedFields();

      if (Object.keys(payload).length === 0) {
        setMessage("ℹ️ No changes detected.");
        setLoading(false);
        return;
      }

      await updateDeliveryProfile(token, payload);
      setMessage("✅ Profile updated successfully!");
      setTimeout(() => navigate("/delivery/dashboard/getprofile"), 1500);
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };
 const ToggleSwitch = ({ label, isOn, setIsOn }) => (
   <div
     className={`flex items-center justify-between p-4 rounded-full shadow-sm cursor-pointer transition-colors ${
       isOn ? "bg-green-500" : "bg-gray-200"
     }`}
     onClick={() => setIsOn(!isOn)}
   >
     <span
       className={`font-semibold transition-colors ${
         isOn ? "text-white" : "text-gray-700"
       }`}
     >
       {label}
     </span>
     <div className={`w-12 h-6 rounded-full relative transition-colors`}>
       <div
         className={`w-6 h-6 bg-white rounded-full shadow-md absolute top-0.5 transition-transform`}
         style={{ transform: isOn ? "translateX(24px)" : "translateX(0)" }}
       ></div>
     </div>
   </div>
 );


  return (
    <>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl border">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Edit Company & Personal Profile
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Personal Info */}
          <div>
            <label className="block mb-1 font-semibold">User Name</label>
            <input
              type="text"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Phone Number</label>
            <input
              type="text"
              name="user_phone"
              value={formData.user_phone}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Company Info */}
          <div>
            <label className="block mb-1 font-semibold">Company Name</label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Coverage Areas */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-semibold">Coverage Areas</label>

            <select
              className="w-full border p-2 rounded mb-2"
              onChange={(e) => {
                const area = e.target.value;
                if (!formData.coverage_areas.includes(area)) {
                  setFormData((prev) => ({
                    ...prev,
                    coverage_areas: [...prev.coverage_areas, area],
                  }));
                }
                e.target.value = "";
              }}
              value=""
            >
              <option value="" disabled>
                Select an area
              </option>
              {ALLOWED_AREAS.filter(
                (a) => !formData.coverage_areas.includes(a)
              ).map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap gap-2">
              {formData.coverage_areas.map((area) => (
                <span
                  key={area}
                  className="flex items-center bg-green-200 text-green-800 px-2 py-1 rounded-full"
                >
                  {area}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        coverage_areas: prev.coverage_areas.filter(
                          (a) => a !== area
                        ),
                      }))
                    }
                    className="ml-2 text-red-600 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 flex gap-4 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/delivery/dashboard/getprofile")}
              className="flex-1 bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>

        {message && <p className="mt-4 text-center font-medium">{message}</p>}
      </div>
      <div className="max-w-sm mx-auto mt-8 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          General Settings
        </h2>
        <ToggleSwitch
          label="Dark Mode"
          isOn={darkModeOn}
          setIsOn={setDarkModeOn}
        />
        <ToggleSwitch
          label="Notifications"
          isOn={notificationsOn}
          setIsOn={setNotificationsOn}
        />
      </div>
    </>
  );
}
