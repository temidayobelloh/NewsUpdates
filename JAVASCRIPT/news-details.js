const apiUrl = 'https://61924d4daeab5c0017105f1a.mockapi.io/skaet/v1/news';
const sliderContainer = document.getElementById('sliderContainer');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const newsDetailContainer = document.getElementById('newsDetailContainer');
const commentSection = document.getElementById('commentSection');
let currentSlide = 0;
let newsItems = [];

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

async function fetchFullNews(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch full article');
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem fetching the full article:', error);
    }
}

async function fetchComments(newsId) {
    try {
        const response = await fetch(`${apiUrl}/${newsId}/comments`);
        if (!response.ok) {
            throw new Error('Failed to fetch comments');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching comments:', error);
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
            <a href="#" class="read-more" data-id="${item.id}">Read more</a>
        `;
        sliderContainer.appendChild(card);
    });
    updateSlider();
}

async function displaySingleNews(newsId) {
    const fullNews = await fetchFullNews(newsId);
    
    newsDetailContainer.innerHTML = `
        <img src="${fullNews.avatar}" alt="Avatar of ${fullNews.author}">
        <h2>${fullNews.title}</h2>
        <p>Author: ${fullNews.author}</p>
        <p>${fullNews.content}</p>
        <a href="${fullNews.url}" target="_blank">Read full article</a>
    `;

    const comments = await fetchComments(newsId);
    displayComments(comments);

    const commentForm = document.createElement('form');
    commentForm.id = 'commentForm';

    const authorInput = document.createElement('input');
    authorInput.type = 'text';
    authorInput.id = 'commentAuthor';
    authorInput.placeholder = 'Your name';
    authorInput.required = true;

    const commentTextarea = document.createElement('textarea');
    commentTextarea.id = 'commentBody';
    commentTextarea.placeholder = 'Your comment';
    commentTextarea.required = true;

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Add Comment';

    commentForm.appendChild(authorInput);
    commentForm.appendChild(commentTextarea);
    commentForm.appendChild(submitButton);
    
    commentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const username = authorInput.value;
        const userComment = commentTextarea.value;

        if (username && userComment) {
            const newComment = { name: username, content: userComment };
            await postComment(newsId, newComment);
            const updatedComments = await fetchComments(newsId);
            displayComments(updatedComments);
            commentForm.reset();
        } else {
            alert("Please enter both your name and comment.");
        }
    });

    newsDetailContainer.appendChild(commentForm);
}

function displayComments(comments) {
    commentSection.innerHTML = "";

    if (comments.length > 0) {
        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment';
            commentDiv.innerHTML = `
                <p><strong>${comment.name}:</strong> ${comment.content}</p>
            `;
            commentSection.appendChild(commentDiv);
        });
    } else {
        const noCommentsMessage = document.createElement('p');
        noCommentsMessage.textContent = "No existing comments.";
        commentSection.appendChild(noCommentsMessage);
    }
}

async function postComment(newsId, comment) {
    try {
        const response = await fetch(`${apiUrl}/${newsId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(comment),
        });
        if (!response.ok) {
            throw new Error('Error posting comment');
        }
        return await response.json();
    } catch (error) {
        console.error('Error posting comment:', error);
    }
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

sliderContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('read-more')) {
        event.preventDefault();
        const newsId = event.target.dataset.id;
        displaySingleNews(newsId);
    }
});

async function init() {
    newsItems = await fetchNews();
    displaySlider();
}

init();
