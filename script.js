const bookForm = document.querySelector('#bookForm');
const bookList = document.querySelector('#bookList');
const formDialog = document.querySelector('#form-dialog');

let myLibrary = JSON.parse(localStorage.getItem('myLibrary')) || [];

function Book(title, author, pages, isRead) {
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author; 
  this.pages = pages;
  this.isRead = isRead;
}

Book.prototype.toggleRead = function() {
  this.isRead = !this.isRead;
}

function addBookToLibrary(title, author, pages, isRead) {
  const newBook = new Book(title, author, pages, isRead);
  myLibrary.push(newBook);
  updateStorage();
}

function updateStorage() {
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

function displayBooks() {
  bookList.innerHTML = '';

  myLibrary.forEach((book) => {
    const newListItem = document.createElement('li');
    newListItem.classList.add('book-card');
    newListItem.setAttribute('data-id', book.id);

    const readStatusText = book.isRead ? "Yes" : "No";

    newListItem.innerHTML= `
      <strong>Book Title:</strong> ${book.title} <br>
      <strong>Author:</strong> ${book.author} <br>
      <strong>Pages:</strong> ${book.pages} <br>
      <strong>Read?:</strong> ${readStatusText} <br>
      <button class="toggle-read-btn">Change Read Status</button>
      <button class="remove-btn">Remove Book</button>
    `;
    bookList.appendChild(newListItem);
  });
}

bookList.addEventListener('click', function(event) {
  const target = event.target;
  const listItem = target.closest('li');
  if (!listItem)return;

  const bookId = listItem.getAttribute('data-id');
  const bookIndex = myLibrary.findIndex(b => b.id === bookId);

  if (bookIndex === -1) return;

  if (target.classList.contains('remove-btn')) {
    myLibrary.splice(bookIndex, 1);
    updateStorage();
    displayBooks();
  }

  if (target.classList.contains('toggle-read-btn')) {
    const bookData = myLibrary[bookIndex];

    Object.setPrototypeOf(bookData, Book.prototype);

    bookData.toggleRead();
    updateStorage();
    displayBooks();
  }
});

bookForm.addEventListener('submit', function(event) {
  
  const title = document.querySelector('#bookTitle').value;
  const author = document.querySelector('#bookAuthor').value;
  const pages = document.querySelector('#bookPages').value;
  const isRead = document.querySelector('#bookRead').checked;

  addBookToLibrary(title, author, pages, isRead);
  displayBooks();
  setTimeout(() => bookForm.reset(), 100);
});

displayBooks();
