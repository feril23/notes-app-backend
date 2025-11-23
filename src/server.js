const Hapi = require("@hapi/hapi");
const notes = require("./api/notes");
const NotesService = require("./services/inMemory/NotesService");
const NotesValidator = require("./validator/notes");

const init = async () => {
  const notesService = new NotesService();
  const server = Hapi.server({
    port: 4000,
    host: process.env.NODE_ENV !== "production" ? "0.0.0.0" : "0.0.0.0",
    routes: {
      cors: {
        origin: ["https://notesapp-v1.dicodingacademy.com"],
      },
    },
  });

  await server.register({
    plugin: notes,
    options: {
      service: notesService,
      validator: NotesValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
