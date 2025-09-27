import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Plus } from "lucide-react";
import {
  fetchDeliveryProfile,
  fetchCoverageAreas,
  addCoverage,
} from "./DeliveryAPI";

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

export default function DeliveryProfile() {
  const [company, setCompany] = useState(null);
  const [coverage, setCoverage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized");

        const [profile, coverageData] = await Promise.all([
          fetchDeliveryProfile(token),
          fetchCoverageAreas(token),
        ]);

        setCompany(profile.company);
        setCoverage(coverageData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSaveCoverage = async () => {
    try {
      const token = localStorage.getItem("token");
      const updated = await addCoverage(token, selectedAreas);
      setCoverage(updated.coverage_areas);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to add coverage", err);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600">⏳ Loading profile...</p>
    );
  if (error)
    return <p className="text-center mt-10 text-red-600">❌ {error}</p>;

 const avatarText = company.company_name
   ? company.company_name
       .split(" ") // تقسيم الاسم إلى كلمات
       .filter(Boolean) // نتأكد ما فيها فراغات فاضية
       .slice(0, 2) // ناخذ أول كلمتين فقط
       .map((word) => word[0].toUpperCase()) // أول حرف من كل كلمة وتحويله للكابيتال
       .join("") // دمجهم مع بعض
   : "??";

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 rounded-2xl shadow-lg border bg-white">
      {/* Avatar */}
      <div className="flex items-center justify-center mb-8 gap-4">
        <div className="w-16 h-16 bg-green-600 text-white flex items-center justify-center rounded-full text-2xl font-bold">
          {avatarText}
        </div>
        <h2 className="text-3xl font-bold text-green-700 text-center">
          Delivery Profile
        </h2>
      </div>

      {/* Edit Btn */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() =>
            navigate("/delivery/dashboard/settings", {
              state: { coverageAreas: coverage },
            })
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Delivery Info */}
        <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Delivery Info
          </h3>

          <div className="mb-3">
            <span className="font-semibold text-gray-600">Company Name:</span>{" "}
            <span className="text-gray-800">{company.company_name}</span>
          </div>

          <div className="mb-3">
            <span className="font-semibold text-gray-600">Status:</span>{" "}
            <span
              className={`px-2 py-1 rounded text-sm ${
                company.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {company.status}
            </span>
          </div>

          {/* Coverage Areas */}
          <div className="mb-3">
            <span className="font-semibold text-gray-600">Coverage Areas:</span>
          </div>

          {coverage.length === 0 ? (
            <button
              onClick={() => setShowModal(true)}
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
            >
              ➕ Add Coverage Areas
            </button>
          ) : (
            <ul className="list-disc list-inside text-gray-700 ml-2">
              {coverage.map((area, idx) => (
                <li key={idx}>{area}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Personal Info */}
        <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Personal Info
          </h3>
          <div className="mb-3">
            <span className="font-semibold text-gray-600">Name:</span>{" "}
            <span className="text-gray-800">{company.user_name || "N/A"}</span>
          </div>
          <div className="mb-3">
            <span className="font-semibold text-gray-600">Email:</span>{" "}
            <span className="text-gray-800">{company.user_email || "N/A"}</span>
          </div>
          <div className="mb-3">
            <span className="font-semibold text-gray-600">Phone:</span>{" "}
            <span className="text-gray-800">{company.user_phone || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Select Coverage Areas</h2>
            <div className="max-h-60 overflow-y-auto border rounded p-3">
              {ALLOWED_AREAS.map((area) => (
                <label key={area} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    value={area}
                    checked={selectedAreas.includes(area)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAreas([...selectedAreas, area]);
                      } else {
                        setSelectedAreas(
                          selectedAreas.filter((a) => a !== area)
                        );
                      }
                    }}
                    className="mr-2"
                  />
                  {area}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCoverage}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

