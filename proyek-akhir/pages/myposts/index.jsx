import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import Link from "next/link";

const LayoutComponent = dynamic(() => import("@/layout"));

export default function Home() {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewPost, setViewPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [updatedContent, setUpdatedContent] = useState("");

  const token = Cookies.get("user_token");

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(
        "https://service.pace-unv.cloud/api/user/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setUser(data);
    };

    fetchUserData();
  }, [token]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        "https://service.pace-unv.cloud/api/posts?type=all",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        setPosts(data.data);
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPosts();
    }
  }, [token, fetchPosts]);

  const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    return nameParts.length > 1
      ? nameParts[0][0] + nameParts[1][0]
      : nameParts[0][0];
  };

  const handlePost = async () => {
    await fetch("https://service.pace-unv.cloud/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: postContent }),
    });
    setPostContent("");
    fetchPosts();
  };

  const handleDelete = async (postId) => {
    await fetch(`https://service.pace-unv.cloud/api/delete/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handleLike = async (postId) => {
    await fetch(`https://service.pace-unv.cloud/api/likes/post/${postId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchPosts();
  };

  const handleUnlike = async (postId) => {
    await fetch(`https://service.pace-unv.cloud/api/unlikes/post/${postId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchPosts();
  };

  const handleViewPost = async (postId) => {
    const response = await fetch(
      `https://service.pace-unv.cloud/api/post/${postId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (data.success) {
      setViewPost(data.data);
      setIsViewModalOpen(true);
    }
  };
  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewPost(null);
  };

  const openEditModal = (post) => {
    setIsEditModalOpen(true);
    setEditingPost(post);
    setUpdatedContent(post.description);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingPost(null);
    setUpdatedContent("");
  };

  const handleEditPost = async () => {
    await fetch(
      `https://service.pace-unv.cloud/api/post/update/${editingPost.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: updatedContent }),
      }
    );
    closeEditModal();
    fetchPosts();
  };

  return (
    <LayoutComponent metaTitle="Home">
      <div className="profile-container p-4 sticky top-[64px] bg-white z-40">
        <div className="profile flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-pink-500 text-white flex justify-center items-center">
            {getInitials(user.data?.name)}
          </div>
          <div className="profile-details">
            <p>Email: {user.data?.email}</p>
            <p>Hobby: {user.data?.hobby || "Empty"}</p>
            <p>Date of Birth: {user.data?.dob || "Empty"}</p>
            <p>Phone: {user.data?.phone || "Empty"}</p>
          </div>
        </div>
      </div>

      <div className="post-creation p-4">
        <textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="What's happening?"
          className="w-full p-2 border rounded"
        />
        <button
          type="button"
          onClick={handlePost}
          className="btn mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Post
        </button>
      </div>

      <div className="post-list p-4">
        {posts.length ? (
          // Filter posts to show only the user's posts
          posts
            .filter((post) => post.user?.id === user.data?.id)
            .map((post) => (
              <div
                key={post.id}
                className="post-item p-4 border-b rounded-lg shadow-md mb-4"
              >
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex justify-center items-center">
                    {getInitials(post.user?.name)}
                  </div>
                  <div className="ml-3">
                    <p className="font-bold">{post.user?.name}</p>
                    <p className="text-sm text-gray-500">{post.user?.email}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(post.created_at).toDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-800 mb-2">{post.description}</p>
                <div className="post-actions flex justify-between items-center mt-2 text-gray-500">
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="like-button mr-2"
                      onClick={() =>
                        (post.is_like_post
                          ? handleUnlike(post.id)
                          : handleLike(post.id))
                      }
                    >
                      {post.is_like_post ? (
                        <span className="text-red-500">❤️</span>
                      ) : (
                        <span className="text-gray-500">♡</span>
                      )}
                      {post.likes_count || 0} Likes
                    </button>
                    <Link href={`/reply/${post.id}`}>
                      <button type="button" className="reply-button">
                        💬 {post.replies_count || 0} Replies
                      </button>
                    </Link>
                  </div>
                  <div className="inline-flex">
                    <button
                      type="button"
                      className="text-blue-500 mr-4"
                      onClick={() => handleViewPost(post.id)}
                    >
                      See
                    </button>
                    <button
                      type="button"
                      className="text-yellow-500 mr-4"
                      onClick={() => openEditModal(post)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      className="delete-button text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>

      {isViewModalOpen && (
        <div className="modal fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="post-item p-4 border-b rounded-lg shadow-md mb-4 bg-white w-96">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex justify-center items-center">
                {getInitials(viewPost.user?.name)}
              </div>
              <div className="ml-3">
                <p className="font-bold">{viewPost.user?.name}</p>
                <p className="text-sm text-gray-500">{viewPost.user?.email}</p>
                <p className="text-sm text-gray-400">
                  {new Date(viewPost.created_at).toDateString()}
                </p>
              </div>
            </div>
            <p className="text-gray-800 mb-2">{viewPost.description}</p>
            <div className="post-actions flex justify-between items-center mt-2 text-gray-500">
              <div className="flex items-center">
                <button
                  type="button"
                  className="like-button mr-2"
                  onClick={() =>
                    (viewPost.is_like_post
                      ? handleUnlike(viewPost.id)
                      : handleLike(viewPost.id))
                  }
                >
                  {viewPost.is_like_post ? (
                    <span className="text-red-500">❤️</span>
                  ) : (
                    <span className="text-gray-500">♡</span>
                  )}
                  {viewPost.likes_count || 0} Likes
                </button>
                <Link href={`/reply/${viewPost.id}`}>
                  <button type="button" className="reply-button">
                    💬 {viewPost.replies_count || 0} Replies
                  </button>
                </Link>
              </div>
              <div className="inline-flex">
                {viewPost.is_own_post && (
                  <button
                    type="button"
                    className="text-blue-600 mr-4"
                    onClick={() => setIsViewModalOpen(false)}
                  >
                    Close
                  </button>
                )}
                {viewPost.is_own_post && (
                  <button
                    type="button"
                    className="text-yellow-500 mr-4"
                    onClick={() => openEditModal(viewPost.id)}
                  >
                    Edit
                  </button>
                )}
                {viewPost.is_own_post && (
                  <button
                    type="button"
                    onClick={() => handleDelete(viewPost.id)}
                    className="delete-button text-red-500"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {isEditModalOpen && (
        <div className="modal fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-gray-200 p-6 rounded shadow-md w-full max-w-md sticky z-50 mt-10">
            <h2 className="text-xl font-bold mb-4">Edit Post</h2>
            <textarea
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleEditPost}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Save
              </button>
              <button
                type="button"
                onClick={closeEditModal}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </LayoutComponent>
  );
}
