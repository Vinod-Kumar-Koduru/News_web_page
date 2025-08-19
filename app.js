
const API_KEY = "eb2d322102fd433f8536d56804c8a789";
const API_SEARCH = "https://newsapi.org/v2/everything";
const API_TOP = "https://newsapi.org/v2/top-headlines";
// Elements
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const categorySelect = document.getElementById("categorySelect");
const newsContainer = document.getElementById("newsContainer");
const loader = document.getElementById("loader");
const themeToggle = document.getElementById("themeToggle");

function showLoader() {
  loader.classList.remove("hidden");
  newsContainer.innerHTML = "";
}
function hideLoader() {
  loader.classList.add("hidden");
}

async function fetchNews(query = "latest", category = "") {
  newsContainer.innerHTML = showLoader();

  try {
    let url;
    if (category) {
      url = `${API_TOP}?category=${category}&language=en&pageSize=10&apiKey=${API_KEY}`;
    } else {
      url = `${API_SEARCH}?q=${query}&language=en&pageSize=10&apiKey=${API_KEY}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    hideLoader();

    if (data.articles && data.articles.length > 0) {
      renderNews(data.articles);
    } else {
      newsContainer.innerHTML = "<p>No news found.</p>";
    }
  } catch (err) {
    hideLoader();
    console.error("Error fetching news:", err);
    newsContainer.innerHTML = "<p>Failed to load news.</p>";
  }
}

function renderNews(articles) {
  newsContainer.innerHTML = "";
  articles.forEach((article) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="card-body">
        <img src="${article.urlToImage}" alt="news" />
        <div>
          <h3>${article.title}</h3>
          <p>${article.description ? article.description.slice(0, 120) + "..." : "No description available"}</p>
        </div>
        <button class="read-more-btn">Read More</button>
      </div>
    `;

    card.querySelector(".read-more-btn").addEventListener("click", () => {
      localStorage.setItem("selectedArticle", JSON.stringify(article));
      window.location.href = "articaldetails.html";
    });

    newsContainer.appendChild(card);
  });
}

function applyTheme() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "Light Mode";
  } else {
    document.body.classList.remove("dark");
    themeToggle.textContent = "Dark Mode";
  }
}

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim() || "latest";
  const category = categorySelect.value;
  fetchNews(query, category);
});

categorySelect.addEventListener("change", () => {
  const query = searchInput.value.trim() || "latest";
  const category = categorySelect.value;
  fetchNews(query, category);
});

themeToggle.addEventListener("click", () => {
  const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
  localStorage.setItem("theme", newTheme);
  applyTheme();
});


applyTheme();
fetchNews();
