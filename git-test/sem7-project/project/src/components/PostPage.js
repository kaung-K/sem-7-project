// src/components/PostPage.js
import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { usePost } from "../contexts/PostContext";
import CommentsSection from "./CommentsSection";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PostCard from "./PostCard";

const PostPage = ({ isDarkMode, toggleTheme, isLoggedIn, logout }) => {
  const location = useLocation();
  const [search] = useSearchParams();

  const [highlightedCommentId, setHighlightedCommentId] = useState(null);
  const [author, setAuthor] = useState(null); // ← same pattern as CreatorProfile

  const { post, postId, comments, loading } = usePost();

  // Pick up highlight from state or query (?comment=/ ?highlight=)
  useEffect(() => {
    const fromState = location.state?.highlightCommentId || null;
    const fromQuery = search.get("comment") || search.get("highlight") || null;
    setHighlightedCommentId(fromState || fromQuery);
  }, [location.state, search]);

  // Smooth-scroll to highlighted comment after comments load
  useEffect(() => {
    if (!highlightedCommentId || !comments?.length) return;
    const el =
      document.querySelector(`[data-comment-id="${highlightedCommentId}"]`) ||
      document.getElementById(`comment-${highlightedCommentId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-blue-500");
      setTimeout(() => el.classList.remove("ring-2", "ring-blue-500"), 1500);
    }
  }, [highlightedCommentId, comments]);

  // Load author like CreatorProfile does:
  // - if the post already has a populated author object, use it
  // - else, fetch the public creator by id once and store it
  useEffect(() => {
    if (!post) return;

    const objAuthor =
      (post.author && typeof post.author === "object" ? post.author : null) ||
      (post.creator && typeof post.creator === "object" ? post.creator : null);

    if (objAuthor && (objAuthor?.profilePic?.url || typeof objAuthor?.profilePic === "string")) {
      setAuthor(objAuthor);
      return;
    }

    const authorId =
      objAuthor?._id ||
      objAuthor?.id ||
      post.authorId ||
      post.creatorId ||
      (typeof post.author === "string" ? post.author : null) ||
      (typeof post.creator === "string" ? post.creator : null);

    if (!authorId) {
      setAuthor(null);
      return;
    }

    fetch(`http://localhost:3002/api/public/creator/${authorId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        setAuthor(data);
      })
      .catch(() => {});
  }, [post]);

  if (loading) return <div className="text-center mt-10">Loading post...</div>;
  if (!post) return <div className="text-center mt-10">Post not found</div>;

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} isLoggedIn={isLoggedIn} logout={logout} />
      <main className="max-w-2xl mx-auto py-12 px-4">
        <PostCard
          post={post}
          author={author}               // ← same idea as CreatorProfile
          isDarkMode={isDarkMode}
          highlightId={highlightedCommentId}
        >
          <CommentsSection postId={postId} title="Comments" highlightId={highlightedCommentId} />
        </PostCard>
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default PostPage;
