const apiBaseUrl = 'https://61924d4daeab5c0017105f1a.mockapi.io/skaet/v1';

document.getElementById('newsForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const author = document.getElementById('author').value;
    const avatar = document.getElementById('avatar').value;
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;

    const newsData = {
        author,
        avatar,
        title,
        url
    };

    try {
        const response = await createNews(newsData);
        document.getElementById('message').innerText = 'News created successfully!';
        // Optionally, reset the form
        document.getElementById('newsForm').reset();
    } catch (error) {
        document.getElementById('message').innerText = 'Error creating news: ' + error.message;
    }
});

async function createNews(data) {
    const response = await fetch(`${apiBaseUrl}/news`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
    }

    return response.json();
}
async function createNews(data, retries = 3) {
  try {
      const response = await fetch(`${apiBaseUrl}/news`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      });

      if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
      }

      return response.json();
  } catch (error) {
      if (retries > 0) {
          console.log('Retrying... remaining attempts: ', retries);
          return createNews(data, retries - 1);
      } else {
          throw error;
      }
  }
}
