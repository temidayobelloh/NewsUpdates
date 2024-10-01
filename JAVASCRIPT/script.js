const API_BASE_URL = "https://61924d4daeab5c0017105f1a.mockapi.io/skaet/v1/news";
let currentPage = 1;
let totalPages = 0; // Initialize totalPages to 0
let currentIndex = 0; // Track the current index for the slider
const cardsToShow = 5; // Set how many cards to show at once
let newNewsItems = []; // Array to store newly created news items

// Fetch news articles from the mock API
async function fetchNews(page = 1) {
    try {
        const response = await fetch(`${API_BASE_URL}?page=${page}&limit=${cardsToShow}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

// Fetch total count of news articles to calculate total pages
async function fetchTotalCount() {
    try {
        const response = await fetch(`${API_BASE_URL}`);
        const data = await response.json();
        return data.length; // Return the total number of items
    } catch (error) {
        console.error('Error fetching total count:', error);
    }
}

// Display news in the slider
async function displayNews(page = 1) {
    const newsSlider = document.getElementById('news_slider');
    newsSlider.innerHTML = "";  // Clear existing content
    currentIndex = 0; // Reset current index on new fetch

    try {
        // Fetch existing news items from the API
        const newsItems = await fetchNews(page);

        // Combine new news items with fetched news items
        const allNewsItems = [...newNewsItems, ...newsItems];

        // Render all news items
        allNewsItems.forEach(item => {
            const newsCard = document.createElement('div');
            newsCard.className = 'cards';
            newsCard.innerHTML = `
                <img src="${item.avatar}" alt="${item.title}" />
                <h4>${item.title}</h4>
                <p>Author: ${item.author}</p>
                <a href="news-detail.html?id=${item.url}">Read More..</a>
            `;
            newsSlider.appendChild(newsCard);
        });

        // Update total count for pagination
        const totalCount = await fetchTotalCount(); // Fetch the total count
        totalPages = Math.ceil(totalCount / cardsToShow); // Calculate total pages based on count and limit

        // Update the page info in the pagination
        document.querySelector('.page-info').textContent = `Page ${currentPage} of ${totalPages}`;
        updatePagination(); // Update pagination after displaying news

        // Set up slider functionality
        setupSlider(); // Ensure the slider is set up after cards are created

        // Update the URL without refreshing the page
        window.history.pushState({ page: currentPage }, '', `?page=${currentPage}`);
    } catch (error) {
        console.error('Error displaying news:', error);
    }
}

// Handle new news creation
async function createNews(newsData) {
    try {
        // POST the new news data to the API
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newsData)
        });
        
        const newNews = await response.json(); // Get the newly created news item
        newNewsItems.unshift(newNews); // Prepend the new news item to the array

        // After creating news, reset to page 1 and refresh news display
        currentPage = 1; // Reset to page 1
        await displayNews(currentPage); // Display news on page 1
    } catch (error) {
        console.error('Error creating news:', error);
    }
}

// Handling pagination
function updatePagination() {
    const prevPageBtn = document.getElementById('prev-page-btn');
    const nextPageBtn = document.getElementById('next-page-btn');

    prevPageBtn.disabled = currentPage === 1; // Disable if on the first page
    nextPageBtn.disabled = currentPage === totalPages; // Disable if on the last page

    // Add event listener for "Prev" button
    prevPageBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            displayNews(currentPage);  // Function to display news data
        }
    };

    // Add event listener for "Next" button
    nextPageBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayNews(currentPage);  // Function to display news data
        }
    };
}

// Slider Functionality
function setupSlider() {
    const newsSlider = document.getElementById('news_slider');
    const cards = newsSlider.getElementsByClassName('cards');

    // Show a set of cards based on the current index
    function showCards() {
        // Hide all cards first
        Array.from(cards).forEach(card => {
            card.style.display = 'none';
        });

        // Show cards in the current index range
        for (let i = currentIndex; i < currentIndex + cardsToShow && i < cards.length; i++) {
            if (cards[i]) {
                cards[i].style.display = 'block'; // Show the card
            }
        }
    }

    // Show the initial set of cards
    showCards();

    // Next card set
    document.getElementById('next-slider-btn').onclick = () => {
        currentIndex += cardsToShow; // Move to the next set
        if (currentIndex >= cards.length) {
            currentIndex = 0; // Wrap to the beginning
        }
        showCards(); // Update the display
    };

    // Previous card set
    document.getElementById('prev-slider-btn').onclick = () => {
        currentIndex -= cardsToShow; // Move to the previous set
        if (currentIndex < 0) {
            currentIndex = Math.max(cards.length - cardsToShow, 0); // Wrap to the end
        }
        showCards(); // Update the display
    };
}

// Handle popstate event to manage back/forward navigation
window.onpopstate = async (event) => {
    if (event.state) {
        currentPage = event.state.page; // Set the current page from history state
        await displayNews(currentPage); // Fetch and display news for that page
    }
};

// Initialize news on page load
async function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get('page')) || 1; // Get the page from URL or default to 1
    currentPage = page;
    await displayNews(currentPage);
}

init();
