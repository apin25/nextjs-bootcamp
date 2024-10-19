import { useState } from "react";
import { useMutation } from "@/hooks/useMutation"; // Assuming you're using a custom hook for API requests
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react"; // Assuming Chakra for toast notifications
import Link from "next/link";
export default function Register() {
  const { mutate } = useMutation();
  const toast = useToast();
  const router = useRouter();
  const [payload, setPayload] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    phone: "",
    hobby: "",
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
      url: "https://service.pace-unv.cloud/api/register",
      payload,
    });

    if (!response?.success) {
      toast({
        title: "Registration Failed",
        description: response?.message || "Error during registration",
        status: "error",
        duration: 2000,
        isCloseable: true,
        position: "top",
      });
    } else {
      toast({
        title: "Registration Successful",
        description: "Welcome to Sanber Daily!",
        status: "success",
        duration: 2000,
        isCloseable: true,
        position: "top",
      });

      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full mt-4 mb-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-black">
          Register for Sanber Daily
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={payload.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
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

          <div className="mb-4">
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

          {/* Date of Birth Field */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="dob"
            >
              Date of Birth
            </label>
            <input
              id="dob"
              type="date"
              name="dob"
              value={payload.dob}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your date of birth"
            />
          </div>

          {/* Phone Field */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="text"
              name="phone"
              value={payload.phone}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your phone number"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="hobby"
            >
              Hobby
            </label>
            <input
              id="hobby"
              type="text"
              name="hobby"
              value={payload.hobby}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your hobby"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Register
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/login">
            <span className="text-blue-500 hover:text-blue-700 font-bold">
              Login
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}
