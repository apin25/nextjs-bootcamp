import { useState } from "react";
import { useMutation } from "@/hooks/useMutation";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Link from "next/link";
import { useToast } from "@chakra-ui/react";

export default function Login() {
  const { mutate } = useMutation();
  const toast = useToast();
  const router = useRouter();
  const [payload, setPayload] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setPayload({
      ...payload,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await mutate({
      url: "https://service.pace-unv.cloud/api/login",
      payload,
    });

    if (!response?.success) {
      toast({
        title: "Login Failed",
        description: "Incorrect email or password",
        status: "error",
        duration: 2000,
        isCloseable: true,
        position: "top",
      });
    } else {
      const token = response?.data?.data?.token;
      const expiresAt = new Date(response?.data?.data?.expires_at);

      Cookies.set("user_token", token, {
        expires: expiresAt,
        path: "/",
      });

      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-black">
          Login to Sanber Daily
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={payload.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={payload.password}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link href="/register">
            <span className="text-blue-500 hover:text-blue-700 font-bold">
              Register
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}