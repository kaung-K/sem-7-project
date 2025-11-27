import React, { useState } from 'react';
import { FaEdit, FaHeart, FaRegHeart, FaReply, FaTrash } from "react-icons/fa";
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import IconBtn from './IconBtn';

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export default function Comment({
  id,
  message,
  user,
  createdAt,
  likeCount,
  likedByMe,
  postId,
  parentId,
  onReply,
  onUpdate,
  onDelete,
  onToggleLike,
  getReplies,
  currentUser,
  loading = {}
}) {
  const [areChildrenHidden, setAreChildrenHidden] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const childComments = getReplies ? getReplies(id) : [];
  console.log("Comment user:", user);
  console.log("Comment username?",user.username)
  console.log("Comment user:", JSON.stringify(user, null, 2));
  const commentOwnerId = user?.id || user?._id;
  const deleted = !message;

  function onCommentReply(message) {
    if (!currentUser) return;
    return onReply({
      postId,
      message,
      parentId: id,
      user: currentUser,
    }).then(() => {
      setIsReplying(false);
    });
  }

  function onCommentUpdate(message) {
    return onUpdate({
      message,
      id,
      //userId: currentUser._id,
    }).then(() => {
      setIsEditing(false);
    });
  }

  function onCommentDelete() {
    return onDelete({
      id,
      //userId: currentUser._id,
    });
  }

function onToggleCommentLike() {
  return onToggleLike({ id })
    .then(({ addLike }) => {
      console.log("Toggled like:", addLike)
    })
}


  return (
    <>
      <div className="comment">
        <div className="comment-header">
  <span className="comment-author">{user?.username || "Anonymous"}</span>
          <span className="comment-date">
            {dateFormatter.format(Date.parse(createdAt))}
          </span>
        </div>
        
        {isEditing ? (
          <CommentForm
            autoFocus
            initialValue={message}
            onSubmit={onCommentUpdate}
            loading={loading.update}
            error={loading.updateError}
          />
        ) : (
          <div className="comment-message">
            {deleted ? (
              <em className="text-muted">This comment was deleted</em>
            ) : (
              message
            )}
          </div>
        )}

        {!deleted && (
          <div className="comment-footer">
            <IconBtn
              onClick={onToggleCommentLike}
              disabled={loading.like}
              Icon={likedByMe ? FaHeart : FaRegHeart}
              aria-label={likedByMe ? "Unlike" : "Like"}
            >
              {likeCount}
            </IconBtn>
            
            <IconBtn
              onClick={() => setIsReplying(prev => !prev)}
              isActive={isReplying}
              Icon={FaReply}
              aria-label={isReplying ? "Cancel Reply" : "Reply"}
            />
            
            {currentUser && String(currentUser._id) === String(commentOwnerId) && (
              <>
                <IconBtn
                  onClick={() => setIsEditing(prev => !prev)}
                  isActive={isEditing}
                  Icon={FaEdit}
                  aria-label={isEditing ? "Cancel Edit" : "Edit"}
                />
                <IconBtn
                  disabled={loading.delete}
                  onClick={onCommentDelete}
                  Icon={FaTrash}
                  aria-label="Delete"
                  color="danger"
                />
              </>
            )}
          </div>
        )}
        
        {loading.deleteError && (
          <div className="error-msg mt-1">
            {loading.deleteError.message || String(loading.deleteError)}
          </div>
        )}
      </div>

      {isReplying && (
        <div className="reply-form">
          <CommentForm
            autoFocus
            onSubmit={onCommentReply}
            loading={loading.create}
            error={loading.createError}
          />
        </div>
      )}

      {childComments?.length > 0 && (
        <>
          <div className={`nested-comments-stack ${areChildrenHidden ? "hide" : ""}`}>
            <button
              className="collapse-line"
              aria-label="Hide Replies"
              onClick={() => setAreChildrenHidden(true)}
            />
            <div className="nested-comments">
              <CommentList
                comments={childComments}
                postId={postId}
                onReply={onReply}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onToggleLike={onToggleLike}
                getReplies={getReplies}
                currentUser={currentUser}
                loading={loading}
              />
            </div>
          </div>
          <button
            className={`btn mt-1 ${!areChildrenHidden ? "hide" : ""}`}
            onClick={() => setAreChildrenHidden(false)}
          >
            Show Replies
          </button>
        </>
      )}
    </>
  );
}