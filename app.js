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
  showLoader();
  try {
    const url = `/api/news?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`;
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
    const img = article.urlToImage || "https://via.placeholder.com/600x400?text=No+Image";
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="card-body">
        <img src="${img}" alt="news" />
        <div>
          <h3>${article.title || "Untitled"}</h3>
          <p>${article.description ? article.description.slice(0, 140) + "..." : "No description available"}</p>
        </div>
        <button class="read-more-btn">Read More</button>
      </div>
    `;

    card.querySelector(".read-more-btn").addEventListener("click", () => {
      localStorage.setItem("selectedArticle", JSON.stringify(article));
      window.location.href = "articaldetails.html"; // keep exactly this name or change in both places
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
  fetchNews(query, categorySelect.value);
});

categorySelect.addEventListener("change", () => {
  const query = searchInput.value.trim() || "latest";
  fetchNews(query, categorySelect.value);
});

themeToggle.addEventListener("click", () => {
  const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
  localStorage.setItem("theme", newTheme);
  applyTheme();
});


applyTheme();
fetchNews();
