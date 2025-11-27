import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // e.g. http://localhost:3002/api
  withCredentials: true,
});

// Attach JWT to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export function makeRequest(url, options = {}) {
  // Special-case DELETE with body
  if (options.method === "DELETE" && options.data) {
    return api
      .delete(url, { data: options.data })
      .then((res) => res.data)
      .catch((err) => Promise.reject(normalizeErr(err)));
  }

  return api(url, options)
    .then((res) => res.data)
    .catch((err) => Promise.reject(normalizeErr(err)));
}

function normalizeErr(err) {
  const status = err?.response?.status;
  const data = err?.response?.data;
  const message =
    data?.message || err?.message || "Something went wrong";
  return { status, data, message };
}
