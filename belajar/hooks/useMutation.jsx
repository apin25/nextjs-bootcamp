import { useCallback, useState } from "react";

export const useMutation = () => {
  const [data, setData] = useState({
    data: null,
    isLoading: false,
    isError: false,
  });

  const mutate = useCallback(
    async ({ url = "", method = "POST", payload = {}, headers = {} } = {}) => {
      setData({ isLoading: true, isError: false, data: null }); // Set loading state
      try {
        const options = {
          method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
        };

        if (method !== "GET") {
          options.body = JSON.stringify(payload); 
        }

        const response = await fetch(url, options);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Something went wrong");
        }

        setData((prevData) => ({
          ...prevData,
          data: result,
          isLoading: false,
        }));

        return { success: true, data: result };
      } catch (error) {
        setData((prevData) => ({
          ...prevData,
          isError: true,
          isLoading: false,
        }));
        return { success: false, error: error.message };
      }
    },
    []
  );

  return { ...data, mutate };
};
