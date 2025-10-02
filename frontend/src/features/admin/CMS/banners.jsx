import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allCMS, editCMS, deleteCMS } from "./cmsSlice";

export default function BannersForm() {
  const dispatch = useDispatch();
  const { cmsList, loading, error } = useSelector((state) => state.cms);

  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({
    content: "",
    image_url: "",
  });

  useEffect(() => {
    dispatch(allCMS());
  }, [dispatch]);

  const startEdit = (cms, index) => {
    setEditingIndex(index);
    setForm({
      content: cms.content,
      image_url: cms.image_url || "",
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(editCMS({ id: editingIndex, cmsData: form })).then(() => {
      dispatch(
        allCMS({ status: "active", type: "type", title: "Landing Page" })
      );
    });
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this CMS item?")) {
      dispatch(deleteCMS(index)).then(() => {
        dispatch(
          allCMS({ status: "active", type: "type", title: "Landing Page" })
        );
      });
    }
  };

  if (loading) return <p>Loading CMS items...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Edit Pages</h2>
      {cmsList.length === 0 ? (
        <p>No CMS items found.</p>
      ) : (
        <ul className="space-y-4">
          {cmsList.map((cms, index) => (
            <li key={index} className="border p-3 rounded">
              {editingIndex === index ? (
                <form onSubmit={handleSave} className="space-y-2">
                  <textarea
                    value={form.content}
                    onChange={(e) =>
                      setForm({ ...form, content: e.target.value })
                    }
                    className="w-full border p-2"
                    required
                  />
                  <input
                    type="text"
                    value={form.image_url}
                    onChange={(e) =>
                      setForm({ ...form, image_url: e.target.value })
                    }
                    className="w-full border p-2"
                    placeholder="Image URL"
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="px-3 py-1 bg-green-500 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingIndex(null)}
                      className="px-3 py-1 bg-gray-400 text-white rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm">{cms.content}</p>
                    {cms.image_url && (
                      <img
                        src={cms.image_url}
                        alt="CMS"
                        className="w-32 h-auto mt-2 rounded"
                      />
                    )}
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => startEdit(cms, index)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
