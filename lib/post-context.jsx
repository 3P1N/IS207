"use client";

import { createContext, useContext, useState, useCallback } from "react";

const PostContext = createContext(undefined);

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([
    {
      id: "1",
      userId: "2",
      username: "john_doe",
      avatar: "/john-avatar.jpg",
      content:
        "Just launched my new project! Check it out and let me know what you think.",
      image: "/project-screenshot.jpg",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      reactions: { "👍": 5, "❤️": 3 },
      comments: [
        {
          id: "1",
          userId: "3",
          username: "jane_smith",
          avatar: "/jane-avatar.jpg",
          content: "Looks amazing! Great work!",
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        },
      ],
      isVisible: true,
    },
    {
      id: "2",
      userId: "3",
      username: "jane_smith",
      avatar: "/jane-avatar.jpg",
      content: "Beautiful sunset today! Nature is amazing.",
      image: "/sunset-landscape.jpg",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      reactions: { "❤️": 12, "😍": 8 },
      comments: [],
      isVisible: true,
    },
  ]);

  const addPost = useCallback(
    (post) => {
      const newPost = {
        ...post,
        id: String(posts.length + 1),
        createdAt: new Date(),
        reactions: {},
        comments: [],
        isVisible: true,
      };
      setPosts((prev) => [newPost, ...prev]);
    },
    [posts.length]
  );

  const deletePost = useCallback((postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }, []);

  const hidePost = useCallback((postId) => {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, isVisible: false } : p)));
  }, []);

  const showPost = useCallback((postId) => {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, isVisible: true } : p)));
  }, []);

  const addReaction = useCallback((postId, userId, emoji) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const reactions = { ...p.reactions };
          reactions[emoji] = (reactions[emoji] || 0) + 1;
          return { ...p, reactions };
        }
        return p;
      })
    );
  }, []);

  const removeReaction = useCallback((postId, userId, emoji) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const reactions = { ...p.reactions };
          if (reactions[emoji] > 1) {
            reactions[emoji]--;
          } else {
            delete reactions[emoji];
          }
          return { ...p, reactions };
        }
        return p;
      })
    );
  }, []);

  const addComment = useCallback((postId, comment) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [
              ...p.comments,
              {
                ...comment,
                id: String(p.comments.length + 1),
                createdAt: new Date(),
              },
            ],
          };
        }
        return p;
      })
    );
  }, []);

  const deleteComment = useCallback((postId, commentId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: p.comments.filter((c) => c.id !== commentId),
          };
        }
        return p;
      })
    );
  }, []);

  const searchPosts = useCallback(
    (query) => {
      const lowerQuery = query.toLowerCase();
      return posts.filter(
        (p) =>
          p.content.toLowerCase().includes(lowerQuery) ||
          p.username.toLowerCase().includes(lowerQuery)
      );
    },
    [posts]
  );

  return (
    <PostContext.Provider
      value={{
        posts,
        addPost,
        deletePost,
        hidePost,
        showPost,
        addReaction,
        removeReaction,
        addComment,
        deleteComment,
        searchPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export function usePost() {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error("usePost must be used within a PostProvider");
  }
  return context;
}
