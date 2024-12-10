// Article data array to store articles
let articles = [];

// Function to add a new article
function addArticle(article) {
    // Add article to local array
    articles.push(article);
    
    // Check if there are more than 3 articles
    if (articles.length > 3) {
        articles.shift(); // Remove the oldest article
    }

    displayArticles();
}

// Function to display articles in the news feed
function displayArticles(articles) {
    const newsFeed = document.getElementById('newsFeed');
    newsFeed.innerHTML = '';

    articles.forEach((article) => {
        const articleDiv = document.createElement('div');
        articleDiv.className = 'news-article';
        articleDiv.innerHTML = `
            <h2>${article.title}</h2>
            <p>${article.content}</p>
            <p><em>by ${article.author}</em></p>
        `;
        newsFeed.appendChild(articleDiv);
    });
}

// Function to submit an article
function submitArticle() {
    const titleInput = document.querySelector('input[name="title"]').value.trim();
    const contentInput = document.querySelector('textarea[name="content"]').value;

    if (!titleInput) {
        alert('Title is required.');
        return;
    }

    const newArticle = { title: titleInput, content: contentInput };

    fetch('/submit-article', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newArticle)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        // Successfully submitted article, now fetch the latest articles to update the feed
        fetchArticles();
    })
    .catch(error => {
        console.error('Error submitting article:', error);
    });
}

// Function to fetch and display articles from the server
function fetchArticles() {
    fetch('http://127.0.0.1:4000/articles')
        .then(response => response.json())
        .then(data => {
            displayArticles(data);
        })
        .catch(error => console.error('Error fetching articles:', error));
}

// Example usage of addArticle function
// This should be replaced with real form submission data
function exampleAddArticle() {
    const articleTitle = document.querySelector('input[name="articleTitle"]').value;
    const content = document.querySelector('textarea[name="content"]').value;

    if (!articleTitle || articleTitle.trim() === "") {
        alert('제목은 필수입니다.');
        return;
    }

    fetch('http://127.0.0.1:4000/submit-article', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ articleTitle, content })
    })
    .then(response => response.json())
    .then(data => {
        alert('기사 제출 성공');
        fetchArticles(); // Refresh the articles list
    })
    .catch(error => console.error('Error submitting article:', error));
}

// Call exampleAddArticle function for testing (remove or comment out in production)
fetchArticles();
