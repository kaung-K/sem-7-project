// src/services/creator.js
export async function upgradeToCreator(payload = {}) {
  const token = localStorage.getItem("token");
  // you already use this pattern elsewhere:
  const API = process.env.REACT_APP_API_URL || "http://localhost:3002/api";

  const res = await fetch(`${API}/private/upgrade`, {   // 👈 correct path
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    // surface the status so you saw “404”
    const err = await res.json().catch(() => ({}));
    const msg = err?.message ? `${err.message}` : `Upgrade failed with ${res.status}`;
    throw new Error(msg);
  }
  return res.json(); // { success, onboardingUrl, ... }
}
