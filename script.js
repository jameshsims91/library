const bookForm = document.querySelector('#bookForm');
const bookList = document.querySelector('#bookList');
const formDialog = document.querySelector('#form-dialog');

// Rehydrate plain storage objects into Book instances automatically
let myLibrary = (JSON.parse(localStorage.getItem('myLibrary')) || []).map(bookData => {
  return Object.assign(Object.create(Book.prototype), bookData);
});

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
    const statusClass = book.isRead ? "status-read" : "status-unread";
    
    newListItem.innerHTML = `
      <p class="book-info"><strong>Book Title:</strong> <span class="book-title">${book.title}</span></p>
      <p class="book-info"><strong>Author:</strong> <span class="book-author">${book.author}</span></p>
      <p class="book-info"><strong>Pages:</strong> <span class="book-pages">${book.pages}</span></p>
      <p class="book-info"><strong>Read?:</strong> <span class="book-status ${statusClass}">${readStatusText}</span></p>
      <div class="card-btns">
        <button class="toggle-read-btn">Change Read Status</button>
        <button class="remove-btn">Remove Book</button>
      </div>
    `;
    bookList.appendChild(newListItem);
  });
}

// Event Delegation for Library actions
bookList.addEventListener('click', function(event) {
  const target = event.target;
  const listItem = target.closest('li');
  if (!listItem) return;
  
  const bookId = listItem.getAttribute('data-id');
  const bookIndex = myLibrary.findIndex(b => b.id === bookId);
  if (bookIndex === -1) return;

  if (target.classList.contains('remove-btn')) {
    myLibrary.splice(bookIndex, 1);
    updateStorage();
    displayBooks();
  }

  if (target.classList.contains('toggle-read-btn')) {
    myLibrary[bookIndex].toggleRead(); // Works directly now due to map rehydration
    updateStorage();
    displayBooks();
  }
});

// Form Submission & Smooth Dialog Close
bookForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevents page reload
  
  const title = document.querySelector('#bookTitle').value;
  const author = document.querySelector('#bookAuthor').value;
  const pages = document.querySelector('#bookPages').value;
  const isRead = document.querySelector('#bookRead').checked;
  
  addBookToLibrary(title, author, pages, isRead);
  displayBooks();
  
  // Smoothly trigger dialog closure
  formDialog.classList.add('hide');
  formDialog.addEventListener('transitionend', function handler() {
    formDialog.close();
    formDialog.classList.remove('hide');
    bookForm.reset();
    formDialog.removeEventListener('transitionend', handler);
  }, { once: true });
});

// Click outside dialog backdrop to close
formDialog.addEventListener('click', (event) => {
  // If the target clicked is exactly the dialog element frame itself, it's the backdrop
  if (event.target === formDialog) {
    formDialog.classList.add('hide');
    formDialog.addEventListener('transitionend', function handler() {
      formDialog.close();
      formDialog.classList.remove('hide');
      formDialog.removeEventListener('transitionend', handler);
    }, { once: true });
  }
});

// Initial Render
displayBooks();
