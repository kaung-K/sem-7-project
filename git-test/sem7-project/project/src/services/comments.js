import { makeRequest } from "./api";

export function createComment({ postId, message, parentId }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return Promise.reject('User is not authenticated');
  }

  return makeRequest(`/private/comment`, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: { message, postId, parentId },
  });
}




export function updateComment({ message, id }) {
  const token = localStorage.getItem('token');
  return makeRequest(`/private/comment/${id}`, {
    method: "PUT",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: { message },
  });
}


export function deleteComment({ id }) {
  const token = localStorage.getItem('token');
  return makeRequest(`/private/comment/${id}`, {
    method: "DELETE",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}



export function toggleCommentLike({ id: commentId }) {
  const token = localStorage.getItem('token');
  return makeRequest(`/private/like/toggle`, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: { commentId },
  });
}


export function getPost(postId) {
  const token = localStorage.getItem('token');
  return makeRequest(`/private/post/detail/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}


// This function makes a request to get the current user data based on the JWT token.
export function getCurrentUser(token) {
  return makeRequest(`/user`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }).then(data => data.user);
}
