import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Link from "next/link";
import Header from "@/components/header";
export default function PostDetails() {
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyContent, setReplyContent] = useState("");
  const [updatedContent, setUpdatedContent] = useState("");
  const router = useRouter();
  const { id } = router.query;
  const token = Cookies.get("user_token");

  const fetchPostAndReplies = async (postId) => {
    try {
      const postResponse = await fetch(
        `https://service.pace-unv.cloud/api/post/${postId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const postData = await postResponse.json();

      const repliesResponse = await fetch(
        `https://service.pace-unv.cloud/api/replies/post/${postId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const repliesData = await repliesResponse.json();

      if (postData.success && repliesData.success) {
        setPost(postData.data);
        setReplies(repliesData.data);
      } else {
        console.error("Failed to fetch post or replies.");
      }
    } catch (error) {
      console.error("Error fetching post or replies:", error);
    }
  };
  useEffect(() => {
    if (id) {
      fetchPostAndReplies(id);
    }
  }, [id]);
  const handleAddReply = async () => {
    try {
      await fetch(`https://service.pace-unv.cloud/api/replies/post/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: replyContent }),
      });
      setReplyContent("");
      fetchPostAndReplies(id); // Refresh replies after adding a new one
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleDelete = async (replyId) => {
    await fetch(
      `https://service.pace-unv.cloud/api/replies/delete/${replyId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setReplies(replies.filter((reply) => reply.id !== replyId));
  };

  const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    return nameParts.length > 1
      ? nameParts[0][0] + nameParts[1][0]
      : nameParts[0][0];
  };

  if (!post) {
    return <p>Loading post...</p>;
  }
  return (
    <>
      <Header />
      <div className="post-details-page p-4">
        <div className="post-item p-4 border-b rounded-lg shadow-md mb-4">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex justify-center items-center">
              {post.user && post.user.name ? post.user.name[0] : "?"}
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
          {post.is_like_post ? (
            <span className="text-red-500">❤️</span>
          ) : (
            <span className="text-gray-500">♡</span>
          )}
          {post.likes_count || 0} Likes
        </div>

        <Link href="/">
          <button type="button" className="text-blue-500 mr-4">
            Back
          </button>
        </Link>

        <div className="replies-section p-4">
          <h3 className="text-xl font-bold mb-4">Replies</h3>
          {replies.length ? (
            replies.map((reply) => (
              <div key={reply.id} className="reply-item p-4 border-b mb-2">
                <div className="flex items-center mb-2">
                  <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex justify-center items-center">
                    {getInitials(reply.user.name)}
                  </div>
                  <div className="ml-3">
                    <p className="font-bold">{reply.user?.name}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(reply.created_at).toDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600">{reply.description}</p>
                <div className="inline-flex ">
                  {reply.is_own_reply && (
                    <button
                      type="button"
                      onClick={() => handleDelete(reply.id)}
                      className="delete-button text-red-500"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No replies yet.</p>
          )}
        </div>

        <div className="reply-form p-4">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="w-full p-2 border rounded"
          />
          <button
            type="button"
            onClick={handleAddReply}
            className="btn mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Reply
          </button>
        </div>
      </div>
    </>
  );
}