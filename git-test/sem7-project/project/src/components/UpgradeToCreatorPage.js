// src/pages/UpgradeToCreatorPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { upgradeToCreator } from "../services/creator"; // adjust path if needed

const UpgradeToCreatorPage = ({ isDarkMode, user }) => {
  const [form, setForm] = useState({ category: "", fee: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const CATEGORIES = [
  "Art",
  "Music",
  "Coding",
  "Language",
  "Fitness",
  "Education",
  "Gaming",
  "Writing",
  "Photography",
  "Cooking",
  "Travel",
  "Film & Animation",
  "Fashion",
  "Beauty",
  "DIY & Crafts",
  "Spirituality",
  "Business",
  "Finance",
  "Science & Tech",
  "Other"
];

  // if already creator, bounce to creator dashboard
  useEffect(() => {
    if (user?.role === "creator") navigate("/creator-dashboard", { replace: true });
  }, [user, navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.category.trim()) return setError("Category is required.");
    if (form.fee === "" || isNaN(Number(form.fee))) return setError("Fee must be a number.");

    try {
      setLoading(true);
      const { onboardingUrl } = await upgradeToCreator({
        category: form.category.trim(),
        fee: Number(form.fee),
        // username & bio are already handled elsewhere — not sent here
      });

      if (onboardingUrl) {
        window.location.href = onboardingUrl; // go to Stripe Connect onboarding
      } else {
        navigate("/creator-dashboard"); // fallback
      }
    } catch (err) {
      setError(err.message || "Upgrade failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <div className={`rounded-2xl shadow-lg p-6 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
        <h1 className="text-2xl font-bold mb-2">Upgrade to Creator 🚀</h1>
        <p className="text-sm opacity-80 mb-6">
          Set your category and monthly price. You’ll then be redirected to Stripe to complete payouts setup.
        </p>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
  <label className="block text-sm mb-2 font-medium">Category</label>
  <div className="grid grid-cols-2 gap-2">
    {CATEGORIES.map((cat) => (
      <label
        key={cat}
        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-300"
        } ${form.category === cat ? "ring-2 ring-indigo-500" : ""}`}
      >
        <input
          type="radio"
          name="category"
          value={cat}
          checked={form.category === cat}
          onChange={onChange}
          className="accent-indigo-600"
        />
        <span>{cat}</span>
      </label>
    ))}
  </div>
</div>


          <div>
            <label className="block text-sm mb-1">Monthly Fee (USD)</label>
            <input
              type="number"
              name="fee"
              value={form.fee}
              min="0"
              onChange={onChange}
              placeholder="e.g. 5"
              className={`w-full px-3 py-2 rounded-lg border outline-none ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-300"
              }`}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Creating Stripe account…" : "Continue to Stripe"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpgradeToCreatorPage;
