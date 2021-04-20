const { nanoid } = require('nanoid');
const kumpulanBuku = require('./books');

const addBookHandler = (request, h) => {
  const {
    name = 'untitled', year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  const isNoName = name === 'untitled';
  const readPageBiggerThanPageCount = readPage > pageCount;

  if (isNoName) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  // sebelumnya else
  if (readPageBiggerThanPageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  kumpulanBuku.push(newBook);
  const isSuccess = kumpulanBuku.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  // Generic Error
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name = 'untitled', reading, finished } = request.query;

  // name query
  if (name !== 'untitled') {
    const book = kumpulanBuku.filter((n) => n.name.toUpperCase().match(name.toUpperCase()));
    const response = h.response({
      status: 'success',
      data: {
        books: book.map((data) => ({
          id: data.id,
          name: data.name,
          publisher: data.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
  // reading query
  if (reading === '0') {
    const book = kumpulanBuku.filter((n) => n.reading === false);
    const response = h.response({
      status: 'success',
      data: {
        books: book.map((data) => ({
          id: data.id,
          name: data.name,
          publisher: data.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
  if (reading === '1') {
    const book = kumpulanBuku.filter((n) => n.reading === true);
    const response = h.response({
      status: 'success',
      data: {
        books: book.map((data) => ({
          id: data.id,
          name: data.name,
          publisher: data.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
  // finished query
  if (finished === '0') {
    const book = kumpulanBuku.filter((n) => n.finished === false);
    const response = h.response({
      status: 'success',
      data: {
        books: book.map((data) => ({
          id: data.id,
          name: data.name,
          publisher: data.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
  if (finished === '1') {
    const book = kumpulanBuku.filter((n) => n.finished === true);
    const response = h.response({
      status: 'success',
      data: {
        books: book.map((data) => ({
          id: data.id,
          name: data.name,
          publisher: data.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
  const book = kumpulanBuku.map((data) => ({
    id: data.id,
    name: data.name,
    publisher: data.publisher,
  }));
  const response = h.response({
    status: 'success',
    data: {
      books: book,
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const buku = kumpulanBuku.filter((n) => n.id === bookId)[0];

  if (buku !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book: buku,
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name = 'untitled', year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  const isNoName = name === 'untitled';
  const readPageBiggerThanPageCount = readPage > pageCount;
  const index = kumpulanBuku.findIndex((book) => book.id === bookId);

  if (isNoName) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPageBiggerThanPageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  if (index !== -1) {
    kumpulanBuku[index] = {
      ...kumpulanBuku[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  // Id tidak ditemukan di server
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = kumpulanBuku.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    kumpulanBuku.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  // Id tidak ditemukan di server
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
