const newsListElement = document.getElementById("news-list");
const currentPageElement = document.getElementById("current-page");
let currentPage = 1;
let totalPages = 1;  // Will be updated after fetching data

// Function to fetch news from my API
async function fetchNews(page) {
    try {
        const response = await fetch(`https://61924d4daeab5c0017105f1a.mockapi.io/skaet/v1/news?page=${page}&limit=10`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const news = await response.json();
        
        
        const totalItems = response.headers.get('X-Total-Count') || 170;
        totalPages = Math.ceil(totalItems / 10); 
        
        displayNews(news);
        updateCurrentPage(page, totalPages); 
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

// Function to display news articles
function displayNews(news) {
    newsListElement.innerHTML = ''; // Clear the previous content
    
    news.forEach(article => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item'; // Assign class for styling

        newsItem.innerHTML = `
           
            <img src="${article.avatar}" alt="${article.title}" />
             <h4>${article.title}</h4>
            <p>By: ${article.author}</p>
            <a href="news-detail.html?id=${article.id}">Read More</a>
        `;
        
        newsListElement.appendChild(newsItem);
    });
}

// A function to update the current page number in pagination
function updateCurrentPage(page, totalPages) {
    currentPageElement.textContent = `Page ${page} of ${totalPages}`; // Update the span text
}

// A function to handle the "Next" button click for pagination
function handleNextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        fetchNews(currentPage);
    }
}

// A function to handle the "Previous" button click for pagination
function handlePrevPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchNews(currentPage);
    }
}

// Added Event listeners for pagination buttons
document.getElementById("next").addEventListener("click", handleNextPage);
document.getElementById("prev").addEventListener("click", handlePrevPage);

// Initial 
fetchNews(currentPage);
