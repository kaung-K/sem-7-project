import React from "react";
import Comment from "./Comment";

function CommentWrapper({ comment, postId, highlightId, ...props }) {
  const isHighlighted = String(comment._id) === String(highlightId);
  const commentRef = React.useRef(null);

  React.useEffect(() => {
    if (isHighlighted && commentRef.current) {
      commentRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isHighlighted]);

  return (
    <div
    id={`comment-${comment._id}`}
    data-comment-id={comment._id}
      ref={isHighlighted ? commentRef : null}
      className={`comment-stack transition duration-300 ${
        isHighlighted ? "bg-yellow-100 border-l-4 border-yellow-500 rounded-md shadow" : ""
      }`}
    >
      <Comment
        id={comment._id}
        postId={comment.postId || postId}
        parentId={comment.parentId || null}
        message={comment.message}
        user={comment.user}
        createdAt={comment.createdAt}
        likeCount={comment.likeCount}
        likedByMe={comment.likedByMe}
        {...props}
      />
    </div>
  );
}

export default function CommentList({
  comments = [],
  postId,
  onReply,
  onUpdate,
  onDelete,
  onToggleLike,
  getReplies,
  currentUser,
  loading,
  highlightId // ✅ comes from URL query param or notification
}) {
  return comments.map((comment) => (
    <CommentWrapper
      key={comment._id}
      comment={comment}
      postId={postId}
      highlightId={highlightId}
      onReply={onReply}
      onUpdate={onUpdate}
      onDelete={onDelete}
      onToggleLike={onToggleLike}
      getReplies={getReplies}
      currentUser={currentUser}
      loading={loading}
    />
  ));
}

