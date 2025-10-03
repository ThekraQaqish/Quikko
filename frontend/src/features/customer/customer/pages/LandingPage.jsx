import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/cms?type=customer&title=Landing%20Page"
        );

        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error("Server did not return valid JSON");
        }

        if (!data || data.length === 0) {
          throw new Error("No content found for this page");
        }

        setContent(data[0]);
      } catch (err) {
        console.error("Error fetching CMS:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCMS();
  }, []);

  if (loading)
    return <p className="text-center mt-20 text-gray-500">Loading...</p>;

  if (error)
    return (
      <p className="text-center mt-20 text-red-500">
        Error: {error}
      </p>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="flex flex-col md:flex-row items-center md:items-start max-w-6xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* الصورة على اليسار */}
        <div className="md:w-1/2 w-full">
          <img
            src={content.image_url}
            alt="Landing"
            className="w-full h-full object-cover"
          />
        </div>

        {/* النص والزر على اليمين */}
        <div className="md:w-1/2 w-full p-8 flex flex-col justify-center items-start">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {content.title || "Welcome"}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-6">
            {content.content}
          </p>
          <button
            onClick={() => navigate("/auth/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
          >
            Sign In
          </button>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
