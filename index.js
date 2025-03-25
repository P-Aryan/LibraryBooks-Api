
// Base URL for API
const API_BASE_URL = 'http://localhost:8000';

// Function to switch tabs
function openTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // Deactivate all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Show the selected tab content
    document.getElementById(tabName).classList.add('active');

    // Activate the clicked tab
    event.currentTarget.classList.add('active');

    // If view tab is selected, fetch books
    if (tabName === 'view') {
        fetchBooks();
    }
}

// Function to fetch all books
function fetchBooks() {
    fetch(`${API_BASE_URL}/books/`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            displayBooks(data);
        });
}

// Function to display books
function displayBooks(books) {
    const bookListElement = document.getElementById('bookList');

    if (books.length === 0) {
        bookListElement.innerHTML = '<div class="error">No books found</div>';
        return;
    }

    let html = '';
    books.forEach(book => {
        html += `
                    <div class="book-item">
                        <h3>${book.title}</h3>
                        <p><strong>ID:</strong> ${book.id}</p>
                        <p><strong>Author:</strong> ${book.author}</p>
                        <p><strong>Genre:</strong> ${book.genre}</p>
                        <button class="update" onclick="prepareUpdateForm(${book.id}, '${book.title}', '${book.author}', '${book.genre}')">Update</button>
                        <button class="delete" onclick="deleteBookDirect(${book.id})">Delete</button>
                    </div>
                `;
    });

    bookListElement.innerHTML = html;
}

// Function to add a new book
document.getElementById('addBookForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const bookData = {
        id: parseInt(document.getElementById('bookId').value),
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        genre: document.getElementById('genre').value
    };

    fetch(`${API_BASE_URL}/books/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('addMessage').innerHTML = `
                    <div class="success">Book added successfully!</div>
                `;
            document.getElementById('addBookForm').reset();
        })
        .catch(error => {
            document.getElementById('addMessage').innerHTML = `
                    <div class="error">Error adding book: ${error.message}</div>
                `;
        });
});

// Function to fetch a book for updating
function fetchBookForUpdate() {
    const bookId = document.getElementById('updateBookId').value;

    if (!bookId) {
        document.getElementById('updateMessage').innerHTML = `
                    <div class="error">Please enter a book ID</div>
                `;
        return;
    }

    fetch(`${API_BASE_URL}/books/${bookId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Book not found');
            }
            return response.json();
        })
        .then(data => {
            // Populate the update form
            document.getElementById('updateTitle').value = data.title;
            document.getElementById('updateAuthor').value = data.author;
            document.getElementById('updateGenre').value = data.genre;

            // Show the update form
            document.getElementById('updateBookForm').style.display = 'block';
            document.getElementById('updateMessage').innerHTML = '';
        })
        .catch(error => {
            document.getElementById('updateBookForm').style.display = 'none';
            document.getElementById('updateMessage').innerHTML = `
                        <div class="error">${error.message}</div>
                    `;
        });
}

// Function to prepare update form from book list
function prepareUpdateForm(id, title, author, genre) {
    // Switch to update tab
    openTab('update');

    // Set values
    document.getElementById('updateBookId').value = id;
    document.getElementById('updateTitle').value = title;
    document.getElementById('updateAuthor').value = author;
    document.getElementById('updateGenre').value = genre;

    // Show the update form
    document.getElementById('updateBookForm').style.display = 'block';
    document.getElementById('updateMessage').innerHTML = '';
}

// Function to update a book
document.getElementById('updateBookForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const bookId = document.getElementById('updateBookId').value;
    const bookData = {
        id: parseInt(bookId),
        title: document.getElementById('updateTitle').value,
        author: document.getElementById('updateAuthor').value,
        genre: document.getElementById('updateGenre').value
    };

    fetch(`${API_BASE_URL}/books/${bookId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('updateMessage').innerHTML = `
                    <div class="success">Book updated successfully!</div>
                `;
        })
        .catch(error => {
            document.getElementById('updateMessage').innerHTML = `
                    <div class="error">Error updating book: ${error.message}</div>
                `;
        });
});

// Function to delete a book
function deleteBook() {
    const bookId = document.getElementById('updateBookId').value;

    if (confirm('Are you sure you want to delete this book?')) {
        fetch(`${API_BASE_URL}/books/${bookId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('updateMessage').innerHTML = `
                        <div class="success">Book deleted successfully!</div>
                    `;
                document.getElementById('updateBookForm').style.display = 'none';
                document.getElementById('updateBookId').value = '';
            })
            .catch(error => {
                document.getElementById('updateMessage').innerHTML = `
                        <div class="error">Error deleting book: ${error.message}</div>
                    `;
            });
    }
}

// Function to delete a book directly from the book list
function deleteBookDirect(bookId) {
    if (confirm('Are you sure you want to delete this book?')) {
        fetch(`${API_BASE_URL}/books/${bookId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Refresh the book list
                fetchBooks();
                alert('Book deleted successfully!');
            })
            .catch(error => {
                alert(`Error deleting book: ${error.message}`);
            });
    }
}

// Initial fetch of books
fetchBooks();
