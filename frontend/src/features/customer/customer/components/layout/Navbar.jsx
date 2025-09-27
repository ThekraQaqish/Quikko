import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FaBars, FaUser, FaShoppingCart, FaBell } from "react-icons/fa";
import { fetchProfile, updateProfile } from "../../profileSlice";
import { setSearchQuery } from "../../productsSlice"; // ← استيراد الأكشن للبحث
import {fetchAllCarts } from "../../cartSlice";


const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const dispatch = useDispatch();
  const { data: profile, loading } = useSelector((state) => state.profile);
  const products = useSelector((state) => state.products.items || []);

  const { allCarts = [] } = useSelector((state) => state.cart);

  // آخر كارت موجود (نفترض أنه آخر عنصر في المصفوفة)
  const lastCart = allCarts.length ? allCarts[allCarts.length - 1] : null;

  // عدد المنتجات في آخر كارت
  const cartItemCount = lastCart
    ? lastCart.items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const cities = [
    "Amman","Zarqa","Irbid","Aqaba","Mafraq","Jerash","Madaba","Karak","Tafilah","Ma'an","Ajloun"
  ];

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchAllCarts());
  }, [dispatch]);

  const handleCityChange = (e) => {
    dispatch(updateProfile({ ...profile, address: e.target.value }));
  };

  const handleCartClick = () => {
    window.location.href = "/cart";
  };

  // ===== فلترة البحث محليًا مثل الكود الأول =====
  useEffect(() => {
    if (!searchTerm.trim()) return setResults([]);
    const filtered = products.filter(
      (p) => p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResults(filtered);
  }, [searchTerm, products]);

  const handleSearchSelect = (productName) => {
    setSearchTerm(productName);
    setResults([]);
    setDropdownOpen(false);
    // إرسال قيمة البحث للـ Redux slice
    dispatch(setSearchQuery(productName));
  };

  useEffect(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest('.profile-dropdown')) {
      setDropdownOpen(false);
    }
  };
  window.addEventListener('click', handleClickOutside);
  return () => window.removeEventListener('click', handleClickOutside);
}, []);


  return (
    
    <nav className="w-full bg-white shadow flex items-center px-4 py-2">
      <button onClick={toggleSidebar} className="mr-4 text-gray-700">
        <FaBars size={20} />
      </button>

      <Link to="/" className="font-bold text-xl mr-6">Logo</Link>

      <div className="flex items-center mr-6">
        <span className="mr-2">Deliver to</span>
        <select
          className="border rounded px-2 py-1"
          value={profile?.address || ""}
          onChange={handleCityChange}
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 flex items-center mr-6 relative">
        <input
          type="text"
          placeholder="Search"
          className="border px-2 py-1 flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => handleSearchSelect(searchTerm)}>🔍</button>

        {results.length > 0 && (
          <div className="absolute top-full left-0 bg-white border rounded shadow w-full max-h-60 overflow-y-auto z-10">
            {results.map((item) => (
              <div
                key={item.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSearchSelect(item.name)}
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="flex items-center" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <FaUser className="mr-1"/>
            {loading ? "Loading..." : profile ? profile.name : "Guest"}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white border rounded shadow w-40">
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {}}
              >
                Dark/Light Mode
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button onClick={handleCartClick}>
            <FaShoppingCart size={20} />
          </button>
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cartItemCount}
            </span>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
