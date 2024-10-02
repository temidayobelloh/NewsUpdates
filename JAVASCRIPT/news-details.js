const apiUrl = 'https://61924d4daeab5c0017105f1a.mockapi.io/skaet/v1/news';
const sliderContainer = document.getElementById('sliderContainer');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
let currentSlide = 0;
let newsItems = [];

async function fetchFullNews(newsId) {
    try {
        const response = await fetch(`${apiUrl}/${newsId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching full news:", error);
    }
}

async function displaySingleNews(newsId) {
    const fullNews = await fetchFullNews(newsId);
    
    const newsDetailContainer = document.getElementById('newsDetailContainer');

    newsDetailContainer.innerHTML = `
        <img src="${fullNews.avatar}" alt="${fullNews.author}">
        <h2>${fullNews.title}</h2>
        <p>Author: ${fullNews.author}</p>
        <p>${fullNews.content}</p>
        <a href="${fullNews.url}" target="_blank">Read full article</a>
    `;

    newsDetailContainer.scrollIntoView({ behavior: 'smooth' });
}

async function fetchNews(page = 1, limit = 5) {
    try {
        const response = await fetch(`${apiUrl}?page=${page}&limit=${limit}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function displaySlider() {
    sliderContainer.innerHTML = "";
    newsItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
            <img src="${item.avatar}" alt="Avatar of ${item.author}">
            <h3>${item.title}</h3>
            <p>Author: ${item.author}</p>
            <a href="news-detail.html?id=${item.id}" class="read-more" data-id="${item.id}">Read more</a>
        `;
        sliderContainer.appendChild(card);
    });
    updateSlider();
}

function updateSlider() {
    const totalSlides = newsItems.length;
    const slideWidth = document.querySelector('.news-card').offsetWidth;
    sliderContainer.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
}

prevButton.addEventListener('click', () => {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlider();
    }
});

nextButton.addEventListener('click', () => {
    if (currentSlide < newsItems.length - 1) {
        currentSlide++;
        updateSlider();
    }
});

async function init() {
    newsItems = await fetchNews();
    displaySlider();
    const newsId = new URLSearchParams(window.location.search).get('id');
    if (newsId) {
        await displaySingleNews(newsId);
    }
}

document.addEventListener('DOMContentLoaded', init);
