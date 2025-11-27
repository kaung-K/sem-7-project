// src/services/posts.js
import { makeRequest } from "./makeRequest";

// Viewer: fetch a creator's posts (subscription-gated)
export function getCreatorPosts(creatorId) {
  return makeRequest(`/private/post/${creatorId}`);
}

// Creator: fetch my own posts (dashboard)
export function getMyPosts() {
  return makeRequest(`/private/post`);
}

// Single post + comments (detail)
export function getPostDetail(postId) {
  return makeRequest(`/private/post/detail/${postId}`);
}

// src/services/posts.js
export async function togglePostLike(postId) {
  const token = localStorage.getItem("token") || "";

  const res = await fetch(
    `http://localhost:3002/api/private/post/togglepostlike/${postId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );

  // Handle common failures explicitly
  if (res.status === 401) {
    const err = new Error("UNAUTHORIZED");
    err.status = 401;
    throw err;
  }
  if (!res.ok) {
    // Surface body message for debugging
    let message = "Request failed";
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {}
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  // Success (your API returns { liked: boolean })
  return res.json();
}

export async function deletePost(postId) {
  const token = localStorage.getItem("token") || "";
  const res = await fetch(
    `http://localhost:3002/api/private/post/${postId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "Failed to delete post");
  }
  return res.json(); // should return { message, post }
}


/** ---- Backward-compat shims so old imports don't break ---- */
export const getPost = getPostDetail;  // old name -> new route
export const getPosts = getMyPosts;    // old ambiguous name -> "my posts"
