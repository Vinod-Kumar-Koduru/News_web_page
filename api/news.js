// /api/news.js

export default async function handler(req, res) {
    const { q = "latest", category = "" } = req.query;

    const apiKey = process.env.NEWS_API_KEY; // from Vercel environment variable
    const API_SEARCH = "https://newsapi.org/v2/everything";
    const API_TOP = "https://newsapi.org/v2/top-headlines";

    try {
        let url;

        if (category) {
            url = `${API_TOP}?category=${encodeURIComponent(category)}&language=en&pageSize=10&apiKey=${apiKey}`;
        } else {
            url = `${API_SEARCH}?q=${encodeURIComponent(q)}&language=en&pageSize=10&apiKey=${apiKey}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        // Pass API response back to frontend
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ error: "Failed to fetch news" });
    }
}
