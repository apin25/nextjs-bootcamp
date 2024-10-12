export default async function handler(req, res) {
  const API_URL = "https://service.pace-unv.cloud/api/notes";

  if (req.method === "GET") {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch notes" });
    }
  }

  if (req.method === "POST") {
    try {
      const { title, description } = req.body;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      const data = await response.json();
      return res.status(201).json(data);
    } catch (error) {
      return res.status(500).json({ message: "Failed to add note" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
