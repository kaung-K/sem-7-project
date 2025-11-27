import React, { useEffect, useState } from "react";

// keep a tiny in-memory cache so previously loaded URLs don't re-skeleton
const loadedCache = new Set();

export default function Avatar({
  src,
  alt = "avatar",
  className = "",
  size = 40, // px
  rounded = true,
}) {
  const [loaded, setLoaded] = useState(src ? loadedCache.has(src) : false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    if (!src) return;
    if (loadedCache.has(src)) { setLoaded(true); return; }

    const img = new Image();
    img.onload = () => { loadedCache.add(src); setLoaded(true); };
    img.onerror = () => setErrored(true);
    img.src = src;
  }, [src]);

  const radiusCls = rounded ? "rounded-full" : "rounded-lg";
  const sizeStyle = { width: size, height: size };

  // if no src or error, show a neutral skeleton (no silhouette flash)
  if (!src || errored) {
    return (
      <div
        className={`bg-gray-300 dark:bg-gray-700 ${radiusCls} ${className}`}
        style={sizeStyle}
      />
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${radiusCls} ${className}`}
      style={sizeStyle}
    >
      {/* skeleton until loaded */}
      {!loaded && <div className="absolute inset-0 animate-pulse bg-gray-300 dark:bg-gray-700" />}

      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-200 ${loaded ? "opacity-100" : "opacity-0"}`}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
