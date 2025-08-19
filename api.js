// api/news.js
export default async function handler(req, res) {
    const { q = "latest", category = "" } = req.query;

    const API_KEY = process.env.NEWS_API_KEY; // set in Vercel -> Settings -> Environment Variables
    const API_SEARCH = "https://newsapi.org/v2/everything";
    const API_TOP = "https://newsapi.org/v2/top-headlines";

    try {
        let url;
        if (category) {
            url = `${API_TOP}?category=${encodeURIComponent(category)}&country=us&pageSize=10&apiKey=${API_KEY}`;
        } else {
            const query = (q || "latest").trim();
            url = `${API_SEARCH}?q=${encodeURIComponent(query)}&language=en&pageSize=10&apiKey=${API_KEY}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        res.status(response.ok ? 200 : response.status).json(data);
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ message: "Failed to fetch news" });
    }
}
