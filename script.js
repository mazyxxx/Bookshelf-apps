document.addEventListener('DOMContentLoaded', function () {
  const Title = document.querySelector('#Title');
  const Author = document.querySelector('#Author');
  const yearBook = document.querySelector('#yearBook');
  const inputBookIsComplete = document.querySelector('#inputBookIsComplete');
  const bookSubmit = document.querySelector('#bookSubmit');
  const findBook = document.querySelector('#findBook');
  const findSubmit = document.querySelector('#findSubmit');
  const incompleteBookshelfList = document.querySelector('#incompleteBookshelfList');
  const completeBookshelfList = document.querySelector('#completeBookshelfList');

  const mybookshelf = JSON.parse(localStorage.getItem('mybookshelf')) || {
    incomplete: [],
    complete: []
  };

  function refreshBookshelf() {
    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';

    mybookshelf.incomplete.forEach((book, index) => {
      createBookCard(book, index, false);
    });

    mybookshelf.complete.forEach((book, index) => {
      createBookCard(book, index, true);
    });
  }

  function addBook() {
    const title = Title.value;
    const author = Author.value;
    const year = parseInt(yearBook.value); // Konversi tahun ke tipe number
    const isComplete = inputBookIsComplete.checked;

    if (title && author && !isNaN(year)) {
        const book = {
            id: Date.now(),
            title,
            author,
            year,
        };

        if (isComplete) {
            mybookshelf.complete.push(book);
        } else {
            mybookshelf.incomplete.push(book);
        }

        localStorage.setItem('mybookshelf', JSON.stringify(mybookshelf));

        Title.value = '';
        Author.value = '';
        yearBook.value = '';
        inputBookIsComplete.checked = false;

        refreshBookshelf();
    }
}

  function moveBook(index, isComplete) {
    const book = isComplete ? mybookshelf.complete[index] : mybookshelf.incomplete[index];

    if (isComplete) {
      mybookshelf.complete.splice(index, 1);
      mybookshelf.incomplete.push(book);
    } else {
      mybookshelf.incomplete.splice(index, 1);
      mybookshelf.complete.push(book);
    }

    localStorage.setItem('mybookshelf', JSON.stringify(mybookshelf));
    refreshBookshelf();
  }

    
  function createBookCard(book, index, isComplete) {
    const bookItem = document.createElement('article');
    bookItem.classList.add('book_item');
    bookItem.dataset.index = index;

    const action = document.createElement('div');
    action.classList.add('action');

    const deleteButton = document.createElement('button');
    deleteButton.className = 'red';
    deleteButton.textContent = 'Hapus buku';
    deleteButton.addEventListener('click', function () {
        deleteBook(index, isComplete);
    });

    action.appendChild(deleteButton);

    if (book) {
        bookItem.innerHTML = `
        <h3>${book.title}</h3>
        <p>Penulis: ${book.author}</p>
        <p>Tahun: ${book.year}</p>
        <div class="action">
          <button class="green">${isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca'}</button>
        </div>
      `;
    } else {
        bookItem.innerHTML = '<p>Error: Data buku tidak ditemukan.</p>';
    }

    bookItem.appendChild(action);

    if (isComplete) {
        completeBookshelfList.appendChild(bookItem);
    } else {
        incompleteBookshelfList.appendChild(bookItem);
    }
}

function deleteBook(index, isComplete) {
    if (isComplete) {
        mybookshelf.complete.splice(index, 1);
    } else {
        mybookshelf.incomplete.splice(index, 1);
    }
    localStorage.setItem('mybookshelf', JSON.stringify(mybookshelf));
    refreshBookshelf();
}

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('red')) {
        const index = e.target.parentElement.parentElement.dataset.index;
        const isComplete = e.target.parentElement.parentElement.parentElement === completeBookshelfList;
        deleteBook(index, isComplete);
        alert("Buku berhasil dihapus");
    }
  });

  findSubmit.addEventListener('click', function (e) {
      e.preventDefault();
      const searchTerm = findBook.value.toLowerCase();
      const searchResult = mybookshelf.incomplete.concat(mybookshelf.complete).filter(book => book.title.toLowerCase().includes(searchTerm));
      incompleteBookshelfList.innerHTML = '';
      completeBookshelfList.innerHTML = '';
      searchResult.forEach((book, index) => {
        createBookCard(book, index, mybookshelf.complete.includes(book));
      });
    });

  bookSubmit.addEventListener('click', function (e) {
    e.preventDefault();
    addBook();
  });

  incompleteBookshelfList.addEventListener('click', function (e) {
    if (e.target.classList.contains('green')) {
      const index = e.target.parentElement.parentElement.dataset.index;
      moveBook(index, false);
    }
  });

  completeBookshelfList.addEventListener('click', function (e) {
    if (e.target.classList.contains('green')) {
      const index = e.target.parentElement.parentElement.dataset.index;
      moveBook(index, true);
    }
  });

  refreshBookshelf();
});
