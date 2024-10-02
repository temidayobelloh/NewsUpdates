# News Application

## Description
News Application is a simple web application that allows users to view, create, and manage news articles. Users can navigate through a paginated list of news, view details, add comments, and manage news items. The application is built using vanilla JavaScript, HTML, and CSS, with a focus on modular design.

## Features
- **Home Page:** Displays a list of news articles with pagination.
- **Create News:** Form for adding new news articles.
- **News Details Page:** View detailed information about a specific news article, including an image slider and comments section.
- **Comments Management:** Users can add, edit, and delete comments for each news article.

## Technologies Used
- HTML
- CSS
- Vanilla JavaScript
- Mock API for backend interactions

## API Endpoints
This project uses the following API endpoints:
- **GET /news:** Get all news
- **GET /news?page=1&limit=10:** Get paginated news
- **GET /news/:id:** Get news by ID
- **POST /news:** Add a news item
- **PUT /news/:id:** Update a news item
- **DELETE /news/:id:** Delete a news item
- **GET /news/:id/comments:** Get comments on a news article
- **POST /news/:id/comments:** Add a comment to a news article
- **PUT /news/:id/comments/:id:** Edit a comment
- **DELETE /news/:id/comments/:id:** Delete a comment

## Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/temidayobelloh/News_Application.git
