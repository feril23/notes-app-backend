const { nanoid } = require("nanoid");
const notes = require("./notes");

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNotes = {
    id,
    title,
    tags,
    createdAt,
    updatedAt,
    body,
  };

  notes.push(newNotes);

  const isSuccess = notes.filter((note) => note.id == id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      massage: "Catatan berhasil ditambahkan",
      data: {
        notesId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: "fail",
    massage: "Catatan Gagal ditambahkan",
  });

  response.code(500);

  return response;
};

const getAllNotesHanler = () => ({
  status: "success",
  data: {
    notes,
  },
});

const getNotesById = (request, h) => {
  const { id } = request.params;
  const noteById = notes.find((note) => note.id == id);
  if (noteById !== undefined) {
    return {
      status: "success",
      data: {
        note: noteById,
      },
    };
  }

  const response = h.response({
    status: "fail",
    message: "Catatan tidak ditemukan",
  });
  response.code(404);
  return response;
};

const updateNotesById = (request, h) => {
  const { title, tags, body } = request.payload;
  const { id } = request.params;
  const updatedAt = new Date().toISOString();
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    const response = h.response({
      status: "success",
      massage: "Catatan berhasil diubah!",
    });

    response.code(200);
    console.log("catatan berhasil diubah");
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui catatan. Id tidak ditemukan",
  });

  response.code(404);
  return response;
};

const deleteNoteById = (request, h) => {
  const { id } = request.params;
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: "success",
      massage: "Catatan berhasil dihapus!",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    massage: "Catatan gagal dihapus!, id tidak ditemukan",
  });

  response.code(404);

  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHanler,
  getNotesById,
  updateNotesById,
  deleteNoteById,
};
