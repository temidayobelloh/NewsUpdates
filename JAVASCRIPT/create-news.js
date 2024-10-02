// Function to create news article
async function createNews(title, author, avatarFile, content, imageUrl) {
    const newsData = new FormData();
    newsData.append('title', title);
    newsData.append('author', author);
    newsData.append('content', content);
    newsData.append('imageUrl', imageUrl);
    newsData.append('avatar', avatarFile); // Append the file directly

    const feedback = document.getElementById('feedback');
    feedback.innerHTML = '';
    feedback.style.display = 'none';

    try {
        const response = await fetch('https://61924d4daeab5c0017105f1a.mockapi.io/skaet/v1/news', {
            method: 'POST',
            body: newsData, // Use FormData as the body
        });

        if (response.ok) {
            const result = await response.json();
            feedback.innerHTML = 'News article created successfully!';
            feedback.style.display = 'block';
            alert('News Article successfully published');
        } else {
            feedback.innerHTML = 'Failed to create news. Please try again.';
            feedback.style.display = 'block';
        }
    } catch (error) {
        feedback.innerHTML = 'An error occurred. Please try again later.';
        feedback.style.display = 'block';
    }
}

// Function to handle form submission
function handleSubmit(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const avatarFile = document.getElementById('avatar').files[0]; // Get the file
    const content = document.getElementById('content').value;
    const imageUrl = document.getElementById('imageUrl').value;

    createNews(title, author, avatarFile, content, imageUrl); // Pass the file
}

// Add event listener to the form
const newsForm = document.getElementById('news-form');
if (newsForm) {
    newsForm.addEventListener('submit', handleSubmit);
}
