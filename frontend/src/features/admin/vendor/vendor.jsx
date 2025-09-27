import { Vendor } from "./vendorApi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setVendors } from "./vendorSlice";
import VendorCard from "./vendorCard";
import { IoIosSearch } from "react-icons/io";
import { FaFilter } from "react-icons/fa";

export default function VendorPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const dispatch = useDispatch();
  const vendors = useSelector((state) => state.vendors.vendors);

  useEffect(() => {
    const handleVendor = async () => {
      try {
        const result = await Vendor();
        dispatch(setVendors(result.data || []));
      } catch (err) {
        alert(err.message);
      }
    };
    handleVendor();
  }, [dispatch]);

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = vendor.store_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || vendor.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <div className="p-4 bg-white rounded-lg shadow-md mb-6">
        <div className="flex items-center mb-4 space-x-4">
          <div className="relative flex-1">
            <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            <FaFilter className="w-5 h-5" />
          </button>
        </div>
        <div className="flex space-x-4 text-sm font-medium">
          {["all", "approved", "pending", "rejected"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 rounded-full ${
                activeFilter === filter
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(filteredVendors) &&
          filteredVendors.map((vendor) => (
            <VendorCard key={vendor.vendor_id} vendor={vendor} />
          ))}
      </div>
    </>
  );
}
