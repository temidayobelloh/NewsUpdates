// Get the news ID from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const newsId = urlParams.get('id');

// Get references to HTML elements
const newsDetailDiv = document.getElementById('news-detail');
const commentsListDiv = document.getElementById('comments-list');
const commentForm = document.getElementById('comment-form');
const imageSliderDiv = document.getElementById('image-slider');

// Fetch news details by ID
async function fetchNewsDetail() {
    try {
        const response = await fetch(`https://61924d4daeab5c0017105f1a.mockapi.io/skaet/v1/news/${newsId}`);
        const newsDetail = await response.json();
        displayNewsDetail(newsDetail);
    } catch (error) {
        console.error('Error fetching news detail:', error);
    }
}

// Display news detail
function displayNewsDetail(news) {
    const newsHtml = `
        <h1>${news.title}</h1>
        <p>Author: ${news.author}</p>
        <img src="${news.avatar}" alt="${news.title} thumbnail">
        <a href="${news.url}" target="_blank">Read More</a>
    `;
    newsDetailDiv.innerHTML = newsHtml;

    // Fetch and display images for the news
    fetchNewsImages();
}

// Fetch images for the news
async function fetchNewsImages() {
    try {
        const response = await fetch(`https://61924d4daeab5c0017105f1a.mockapi.io/skaet/v1/news/${newsId}/images`);
        const images = await response.json();
        displayImageSlider(images);
    } catch (error) {
        console.error('Error fetching news images:', error);
    }
}

// Display image slider
function displayImageSlider(images) {
    const sliderHtml = images.map(image => `<img src="${image.image}" alt="News Image">`).join('');
    imageSliderDiv.innerHTML = `<div class="slider">${sliderHtml}</div>`;
}

// Fetch comments for the news
async function fetchComments() {
    try {
        const response = await fetch(`https://61924d4daeab5c0017105f1a.mockapi.io/skaet/v1/news/${newsId}/comments`);
        const comments = await response.json();
        displayComments(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

// Display comments
function displayComments(comments) {
    const commentsHtml = comments.map(comment => `
        <div class="comment" data-id="${comment.id}">
            <p><strong>${comment.name}:</strong> ${comment.comment}</p>
            <button onclick="editComment('${comment.id}', '${comment.comment}')">Edit</button>
            <button onclick="deleteComment('${comment.id}')">Delete</button>
        </div>
    `).join('');
    commentsListDiv.innerHTML = commentsHtml;
}

// Add a new comment
commentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const name = document.getElementById('comment-name').value;
    const commentText = document.getElementById('comment-text').value;
    const newComment = { newsId: newsId, name: name, comment: commentText };
    
    try {
        await fetch(`https://61924d4daeab5c0017105f1a.mockapi.io/skaet/v1/news/${newsId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newComment)
        });
        
        fetchComments(); // Refresh comments
        commentForm.reset(); // Reset form
    } catch (error) {
        console.error('Error adding comment:', error);
    }
});

// Edit a comment
async function editComment(commentId, currentComment) {
    const newCommentText = prompt('Edit your comment:', currentComment);
    if (newCommentText) {
        try {
            await fetch(`https://61924d4daeab5c0017105f1a.mockapi.io/skaet/v1/news/${newsId}/comments/${commentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ comment: newCommentText })
            });
            fetchComments(); // Refresh comments
        } catch (error) {
            console.error('Error editing comment:', error);
        }
    }
}

// Delete a comment
async function deleteComment(commentId) {
    if (confirm('Are you sure you want to delete this comment?')) {
        try {
            await fetch(`https://61924d4daeab5c0017105f1a.mockapi.io/skaet/v1/news/${newsId}/comments/${commentId}`, {
                method: 'DELETE'
            });
            fetchComments(); // Refresh comments
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    }
}

// Initial function calls
fetchNewsDetail();
fetchComments();
