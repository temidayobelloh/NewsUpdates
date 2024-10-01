document.getElementById('create-news-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form data
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const content = document.getElementById('content').value.trim();
    const imageUrl = document.getElementById('imageUrl').value.trim();

    // Handle avatar upload (Convert to base64 for API request)
    const avatarInput = document.getElementById('avatar');
    const avatarFile = avatarInput.files[0];

    if (!avatarFile) {
        alert("Please upload an avatar.");
        return; // Exit if no avatar file is selected
    }

    const avatarBase64 = await convertToBase64(avatarFile);
    createNews(title, author, avatarBase64, content, imageUrl);
});

// Function to convert file to base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

// Function to create news and send to the API
async function createNews(title, author, avatar, content, imageUrl) {
    const newsData = {
        title,
        author,
        avatar,
        content,
        imageUrl
    };

    try {
        const response = await fetch('https://61924d4daeab5c0017105f1a.mockapi.io/skaet/v1/news', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newsData),
        });

        if (response.ok) {
            const result = await response.json();
            // Redirect to the news details page with the newly created news ID
            window.location.href = `news-details.html?id=${result.id}`;
        } else {
            alert("Failed to create news. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
    }
}
