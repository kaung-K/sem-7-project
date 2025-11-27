import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { getPost } from "../services/posts";
import {
  toggleCommentLike,
  createComment,
  updateComment,
  deleteComment,
} from "../services/comments"; // ✅ Make sure this path is correct

const Context = React.createContext();

export function usePost() {
  return useContext(Context);
}

export function PostProvider({ children }) {
  const { id } = useParams();
  const { loading, error, value: data } = useAsync(() => getPost(id), [id]);

  const [comments, setComments] = useState([]);

  const commentsByParentId = useMemo(() => {
    const group = {};
    comments.forEach(comment => {
      group[comment.parentId] ||= [];
      group[comment.parentId].push(comment);
    });
    return group;
  }, [comments]);

  useEffect(() => {
    if (data?.comments == null) return;
    setComments(
      data.comments.map(comment => ({
        ...comment,
        id: comment._id,
        parentId: comment.parentId || null,
      }))
    );
  }, [data?.comments]);

  function getReplies(parentId) {
    return commentsByParentId[parentId];
  }

  function createLocalComment(comment) {
    setComments(prev => [comment, ...prev]);
  }

  function updateLocalComment(id, updatedComment) {
    setComments(prev =>
      prev.map(comment =>
        comment._id === id ? updatedComment : comment
      )
    );
  }

  function deleteLocalComment(id) {
    setComments(prev =>
      prev.filter(comment => comment._id !== id)
    );
  }

  function toggleLocalCommentLike(id, addLike) {
    setComments(prev =>
      prev.map(comment => {
        if (comment._id === id) {
          const count = comment.likeCount || 0;
          return {
            ...comment,
            likeCount: addLike ? count + 1 : Math.max(count - 1, 0),
            likedByMe: addLike,
          };
        }
        return comment;
      })
    );
  }

  // ✅ ACTUAL backend toggle like call
  function onToggleLike({ id, userId }) {
    return toggleCommentLike({ id, userId }).then(({ addLike }) => {
      toggleLocalCommentLike(id, addLike);
      return { addLike };
    });
  }

  // ✅ Optional: Real backend comment create/update/delete
  function onReply({ postId, message, parentId, user }) {
    return createComment({ postId, message, parentId, user }).then(comment => {
      createLocalComment({
        ...comment,
        id: comment._id,
        parentId: comment.parentId || null,
      });
    });
  }

  function onUpdate({ id, message, userId }) {
    return updateComment({ id, message, userId }).then(updated => {
      updateLocalComment(id, { ...updated, id: updated._id });
    });
  }

  function onDelete({ id, userId }) {
    return deleteComment({ id, userId }).then(deleted => {
      updateLocalComment(id, {
        ...deleted,
        id: deleted._id,
        message: "", // Soft delete
      });
    });
  }

  return (
    <Context.Provider
      value={{
        post: data?.post || {}, // ✅ Fix: pass post only
        postId: id,
        comments,
        getReplies,
        createComment: onReply,
        updateComment: onUpdate,
        deleteComment: onDelete,
        toggleCommentLike: onToggleLike,
        currentUser: { _id: "688785e69f794e8d634682c7", name: "sally" }, // ✅ consistent _id
        loading,
      }}
    >
      {loading ? (
        <h1>Loading</h1>
      ) : error ? (
        <h1 className="error-msg">{error}</h1>
      ) : (
        children
      )}
    </Context.Provider>
  );
}
