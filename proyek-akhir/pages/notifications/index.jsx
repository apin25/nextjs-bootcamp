import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Header from "@/components/header";
export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const token = Cookies.get("user_token");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "https://service.pace-unv.cloud/api/notifications",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setNotifications(data.data); // Assuming the notifications are in data.data
        } else {
          console.error("Failed to fetch notifications");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [token]);

  // Helper function to get initials
  const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    return nameParts.length > 1
      ? nameParts[0][0] + nameParts[1][0]
      : nameParts[0][0];
  };

  const timeAgo = (createdAt) => {
    const now = new Date();
    const past = new Date(createdAt);
    const diffInMs = now - past;
    const diffInMinutes = Math.floor(diffInMs / 60000);

    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  return (
    <>
      <Header />
      <div className="notifications-page p-4">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        <div className="notifications-list space-y-4">
          {notifications.length ? (
            notifications.map((notification, index) => (
              <div
                key={index}
                className="flex items-center p-4 border rounded-lg shadow-md"
              >
                <div className="w-10 h-10 rounded-full bg-gray-500 text-white flex justify-center items-center">
                  {getInitials(notification.user.name)}
                </div>
                <div className="ml-4">
                  <p className="font-normal">
                    {notification.user.name}{" "}
                    {notification.remark === "like" ? "liked" : "replied to"}{" "}
                    your post,{" "}
                    <span className="text-gray-400 text-sm">
                      {timeAgo(notification.created_at)}
                    </span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No notifications yet.</p>
          )}
        </div>
      </div>
    </>
  );
}
