const {
  addNoteHandler,
  getAllNotesHanler,
  getNotesById,
  updateNotesById,
  deleteNoteById,
} = require("./handler");

const routes = [
  {
    method: "POST",
    path: "/notes",
    handler: addNoteHandler,
  },
  {
    method: "GET",
    path: "/notes",
    handler: getAllNotesHanler,
  },
  {
    method: "GET",
    path: "/notes/{id}",
    handler: getNotesById,
  },
  {
    method: "PUT",
    path: "/notes/{id}",
    handler: updateNotesById,
  },
  {
    method: "DELETE",
    path: "/notes/{id}",
    handler: deleteNoteById,
  },
];

module.exports = routes;
