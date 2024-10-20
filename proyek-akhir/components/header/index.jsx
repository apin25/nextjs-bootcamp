import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [initials, setInitials] = useState(""); // State for user initials
  const router = useRouter();

  useEffect(() => {
    const fetchUserName = async () => {
      const token = Cookies.get("user_token");
      try {
        const response = await fetch(
          "https://service.pace-unv.cloud/api/user/me",
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
          const { name } = data.data;

          const nameParts = name.split(" ");
          const userInitials =            nameParts.length === 1
            ? nameParts[0][0]
            : nameParts[0][0] + nameParts[1][0];

          setInitials(userInitials.toUpperCase());
        } else {
          console.error("Failed to fetch user name");
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    fetchUserName();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    try {
      const token = Cookies.get("user_token");

      const response = await fetch(
        "https://service.pace-unv.cloud/api/logout",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        Cookies.remove("user_token", { path: "/" });
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };
  return (
    <header className="bg-white shadow p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-semibold text-black">Sanber Daily</div>
        <div className="relative flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center text-sm font-semibold">
            {initials}
          </div>
          <button
            type="button"
            onClick={toggleDropdown}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-52 w-48 bg-white border rounded shadow-lg z-20 text-black">
              <ul className="py-1">
                <Link href="/">
                  <li className="px-4 py-2 hover:bg-gray-100">Home</li>
                </Link>
                <Link href="/myposts">
                  <li className="px-4 py-2 hover:bg-gray-100">My Posts</li>
                </Link>
                <Link href="/notifications">
                  <li className="px-4 py-2 hover:bg-gray-100">Notifikasi</li>
                </Link>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}