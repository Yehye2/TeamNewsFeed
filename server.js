const express = require('express');
const cookieParser = require('cookie-parser');
const axios = require('axios');

const app = express();
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Book Search</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
            }

            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                border-radius: 4px;
            }

            .title {
                font-size: 24px;
                margin-bottom: 20px;
            }

            .search-form {
                display: flex;
            }

            .search-input {
                flex: 1;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 4px;
            }

            .search-button {
                padding: 10px 20px;
                background-color: #007bff;
                color: #fff;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }

            .search-results {
                margin-top: 20px;
            }

            .book-container {
                padding: 10px;
                background-color: #f9f9f9;
                border: 1px solid #ccc;
                border-radius: 4px;
                margin-bottom: 10px;
            }

            .book-title {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 5px;
            }

            .book-author {
                font-size: 14px;
                color: #666;
                margin-bottom: 5px;
            }

            .book-description {
                font-size: 14px;
                color: #333;
            }

            .no-results {
                font-size: 16px;
                color: #666;
                text-align: center;
            }

            .bestsellers {
                margin-top: 20px;
                font-size: 16px;
            }

            .bestsellers-item {
                margin-bottom: 5px;
            }
        </style>
    </head>

    <body>
        <div class="container">
            <h1 class="title">Book Search</h1>
            <div class="search-form">
                <input type="text" id="searchInput" class="search-input" placeholder="Enter a book title">
                <button onclick="searchBooks()" class="search-button">Search</button>
            </div>

            <div id="searchResults" class="search-results"></div>

            <div class="bestsellers">
                <h2>Bestsellers</h2>
                <ul id="bestsellersList"></ul>
            </div>
        </div>

        <script>
            function searchBooks() {
                var query = document.getElementById('searchInput').value;
                var url = '/search?q=' + encodeURIComponent(query);

                fetch(url)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (books) {
                        var resultsContainer = document.getElementById('searchResults');
                        resultsContainer.innerHTML = '';

                        if (books && books.length > 0) {
                            for (var i = 0; i < books.length; i++) {
                                var book = books[i];

                                var bookContainer = document.createElement('div');
                                bookContainer.className = 'book-container';

                                var bookTitle = document.createElement('h3');
                                bookTitle.className = 'book-title';
                                bookTitle.textContent = book.title;

                                var bookAuthor = document.createElement('p');
                                bookAuthor.className = 'book-author';
                                bookAuthor.textContent = 'Author: ' + book.author;

                                var bookDescription = document.createElement('p');
                                bookDescription.className = 'book-description';
                                bookDescription.textContent = 'Description: ' + book.description;

                                bookContainer.appendChild(bookTitle);
                                bookContainer.appendChild(bookAuthor);
                                bookContainer.appendChild(bookDescription);

                                resultsContainer.appendChild(bookContainer);
                            }
                        } else {
                            var noResultsMessage = document.createElement('p');
                            noResultsMessage.className = 'no-results';
                            noResultsMessage.textContent = 'No books found.';
                            resultsContainer.appendChild(noResultsMessage);
                        }
                    })
                    .catch(function (error) {
                        console.error('Error searching books:', error);
                    });
            }

            function displayBestsellers() {
                var bestsellersList = document.getElementById('bestsellersList');

                fetch('/bestsellers')
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (bestsellers) {
                        if (bestsellers && bestsellers.length > 0) {
                            for (var i = 0; i < bestsellers.length; i++) {
                                var bestseller = bestsellers[i];

                                var bestsellerItem = document.createElement('li');
                                bestsellerItem.className = 'bestsellers-item';
                                bestsellerItem.textContent = bestseller.title;

                                bestsellersList.appendChild(bestsellerItem);
                            }
                        } else {
                            var noBestsellersMessage = document.createElement('li');
                            noBestsellersMessage.className = 'bestsellers-item';
                            noBestsellersMessage.textContent = 'No bestsellers found.';

                            bestsellersList.appendChild(noBestsellersMessage);
                        }
                    })
                    .catch(function (error) {
                        console.error('Error fetching bestsellers:', error);
                    });
            }

            displayBestsellers();
        </script>
    </body>
    </html>
  `);
});

app.get('/search', (req, res) => {
    const query = req.query.q;

    axios
        .get('http://www.aladin.co.kr/ttb/api/ItemSearch.aspx', {
            params: {
                ttbkey: 'ttbtiwh11427001',
                Query: query,
                QueryType: 'Title',
                MaxResults: 10,
                start: 1,
                SearchTarget: 'Book',
                output: 'js',
                Version: '20131101'
            },
        })
        .then(response => {
            const books = response.data.item;

            if (books && books.length > 0) {
                res.json(books);
            } else {
                res.json({ message: 'No books found.' });
            }
        })
        .catch(error => {
            console.error('Error searching books:', error);
            res.status(500).json({ error: 'An error occurred while searching books.' });
        });
});

app.get('/bestsellers', (req, res) => {
    axios
        .get('http://www.aladin.co.kr/ttb/api/ItemList.aspx', {
            params: {
                ttbkey: 'ttbtiwh11427001',
                QueryType: 'BestSeller',
                MaxResults: 2,
                start: 1,
                output: 'js',
                Version: '20131101'
            },
        })
        .then(response => {
            const bestsellers = response.data.item;

            if (bestsellers && bestsellers.length > 0) {
                res.json(bestsellers);
            } else {
                res.json({ message: 'No bestsellers found.' });
            }
        })
        .catch(error => {
            console.error('Error fetching bestsellers:', error);
            res.status(500).json({ error: 'An error occurred while fetching bestsellers.' });
        });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
