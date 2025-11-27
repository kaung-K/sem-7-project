import React, { useState, useMemo, useEffect } from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { useAsyncFn } from '../hooks/useAsync';
import {
  createComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
  getPost,
  getCurrentUser
} from '../services/comments';

export default function CommentsSection({ postId, title = "Comments", highlightId }) {
  const [comments, setComments] = useState([]);
    const [currentUser, setCurrentUser] = useState(null); // Real user
  
  const createCommentFn = useAsyncFn(createComment);
  const updateCommentFn = useAsyncFn(updateComment);
  const deleteCommentFn = useAsyncFn(deleteComment);
  const toggleCommentLikeFn = useAsyncFn(toggleCommentLike);

   // Fetch the current user based on token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');  // Get the token
    if (token) {
      getCurrentUser(token)  // Assume this is an API call that returns the user data
        .then(user => {
          setCurrentUser(user);
          console.log('Current user set:', user);  // Log the user data
        })
        .catch(err => {
          console.error('Failed to get current user:', err);
        });
    }
  }, []);

  // Group comments by parentId for nested structure
  const commentsByParentId = useMemo(() => {
    const group = {};
    comments.forEach(comment => {
      group[comment.parentId] ||= [];
      group[comment.parentId].push(comment);
    });
    return group;
  }, [comments]);


  const rootComments = commentsByParentId[null] || [];

  // Load comments for the post
  useEffect(() => {
    if (postId) {
      getPost(postId)
        .then(data => {
          if (data?.comments) {
            setComments(
              data.comments.map(comment => ({
                ...comment,
                id: comment._id,
                parentId: comment.parentId || null,
              }))
            );
          }
        })
        .catch(error => {
          console.error('Failed to load comments:', error);
        });
    }
  }, [postId]);

  function getReplies(parentId) {
    return commentsByParentId[parentId];
  }

  function createLocalComment(comment) {
    setComments(prevComments => [comment, ...prevComments]);
  }

  function updateLocalComment(id, updatedComment) {
    setComments(prevComments => {
      return prevComments.map(comment => 
        comment._id === id ? updatedComment : comment
      );
    });
  }

  function deleteLocalComment(id) {
    setComments(prevComments => {
      return prevComments.filter(comment => comment._id !== id);
    });
  }

  function toggleLocalCommentLike(id, addLike) {
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (id === comment._id) {
          const currentCount = comment.likeCount || 0;
          return {
            ...comment,
            likeCount: addLike ? currentCount + 1 : Math.max(currentCount - 1, 0),
            likedByMe: addLike,
          };
        }
        return comment;
      });
    });
  }

  // Handler functions
  function onCommentCreate(message) {
  if (!currentUser) return Promise.reject('User not logged in');

  return createCommentFn.execute({
    postId,
    message,
    parentId: null,
  }).then(comment => {
    createLocalComment(comment);
  });
}

function onCommentReply({ postId, message, parentId }) {
  return createCommentFn.execute({
    postId,
    message,
    parentId,
  }).then(comment => {
    createLocalComment(comment);
  });
}


  function onCommentUpdate({ message, id, userId }) {
    return updateCommentFn.execute({
      message,
      id,
      userId,
    }).then(comment => {
      updateLocalComment(id, comment);
    });
  }

  function onCommentDelete({ id, userId }) {
    return deleteCommentFn.execute({
      id,
      userId,
    }).then((deletedComment) => {
      updateLocalComment(id, deletedComment);
    });
  }

  function onToggleCommentLike({ id, userId }) {
    return toggleCommentLikeFn.execute({
      id,
      userId,
    }).then(({ addLike }) => {
      toggleLocalCommentLike(id, addLike);
      return { addLike }
    });
  }

  const loading = {
    create: createCommentFn.loading,
    createError: createCommentFn.error,
    update: updateCommentFn.loading,
    updateError: updateCommentFn.error,
    delete: deleteCommentFn.loading,
    deleteError: deleteCommentFn.error,
    like: toggleCommentLikeFn.loading,
    likeError: toggleCommentLikeFn.error,
  };

  return (
    <div className="comments-section">
      <h3 className="comments-title">{title} ({comments.length})</h3>
      
      <div className="comment-form-section">
        <CommentForm
          onSubmit={onCommentCreate}
          loading={createCommentFn.loading}
          error={createCommentFn.error}
        />
      </div>

      {rootComments.length > 0 && (
        <div className="comments-list">
          <CommentList
            comments={rootComments}
            postId={postId}
            onReply={onCommentReply}
            onUpdate={onCommentUpdate}
            onDelete={onCommentDelete}
            onToggleLike={onToggleCommentLike}
            getReplies={getReplies}
            currentUser={currentUser}
            loading={loading}
             highlightId={highlightId}   // ✅ pass it through
          />
        </div>
      )}

      {comments.length === 0 && (
        <div className="no-comments">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
}