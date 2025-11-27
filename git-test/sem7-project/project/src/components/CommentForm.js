import React, { useState } from "react";

export default function CommentForm({
  loading,
  error,
  onSubmit,
  autoFocus = false,
  initialValue = "",
}) {
  const [message, setMessage] = useState(initialValue);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(message).then(() => setMessage(""));
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <div className="comment-form-row">
        <textarea
          placeholder="Write a comment..."
          aria-label="Comment"
          autoFocus={autoFocus}
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="message-input"
        />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Loading" : "Post"}
        </button>
      </div>
      {error && (
        <div className="error-msg">{error.message || String(error)}</div>
      )}
    </form>
  );
}