import React from "react";
import { PostProvider } from "../contexts/PostContext";
import PostPage from "./PostPage";

export default function PostPageWrapper(props) {
  return (
    <PostProvider>
      <PostPage {...props} />
    </PostProvider>
  );
}
