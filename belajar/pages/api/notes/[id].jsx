export default async function handler(req, res) {
  const { id } = req.query;
  const API_URL_GET = `https://service.pace-unv.cloud/api/notes/${id}`;
  const API_URL_UPDATE = `https://service.pace-unv.cloud/api/notes/update/${id}`;
  const API_URL_DELETE = `https://service.pace-unv.cloud/api/notes/delete/${id}`;
  if (req.method === "GET") {
    try {
      const response = await fetch(API_URL_GET);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("GET request error:", response.status, errorData);
        return res
          .status(response.status)
          .json({ message: "Failed to fetch note" });
      }
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error("GET request exception:", error);
      return res.status(500).json({ message: "Failed to fetch note" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const response = await fetch(API_URL_DELETE, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.text(); // Use text() in case the response is not JSON
        console.error("DELETE request error:", response.status, errorData);
        return res
          .status(response.status)
          .json({ message: "Failed to delete note" });
      }
      return res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
      console.error("DELETE request exception:", error);
      return res.status(500).json({ message: "Failed to delete note" });
    }
  }

  if (req.method === "PATCH") {
    try {
      const { title, description } = req.body;

      if (!title || !description) {
        return res
          .status(400)
          .json({ message: "Title and description are required" });
      }

      const response = await fetch(API_URL_UPDATE, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        const errorData = await response.text(); // Use text() to capture error message if not JSON
        console.error("PATCH request error:", response.status, errorData);
        return res
          .status(response.status)
          .json({ message: "Failed to update note", error: errorData });
      }

      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error("PATCH request exception:", error);
      return res.status(500).json({ message: "Failed to update note" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
