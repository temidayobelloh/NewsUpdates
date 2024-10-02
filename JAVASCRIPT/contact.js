function showAlert(message) {
    document.getElementById('alert-message').innerText = message;
    document.getElementById('custom-alert').style.display = 'block';
}

function hideAlert() {
    document.getElementById('custom-alert').style.display = 'none';
}

document.querySelector('.close-button').addEventListener('click', hideAlert);

document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const formData = {
        newsId: "1",
        email: email,
        comment: message
    };
    fetch(`https://61924d4daeab5c0017105f1a.mockapi.io/skaet/v1/news/1/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        showAlert('Message sent successfully!');
        document.getElementById('contact-form').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('Failed to send the message. Please try again.');
    });
});

document.getElementById('back-home').addEventListener('click', function() {
    window.location.href = 'index.html';
});
