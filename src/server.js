/* eslint-disable no-undef */
const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
require("dotenv").config();

// Exceptions
const ClientError = require("./exceptions/ClientError");

// Music
const notes = require("./api/notes");
const NotesService = require("./services/postgres/NotesService");
const NotesValidator = require("./validator/notes");

// Users
const users = require("./api/users");
const UsersService = require("./services/database/UsersService"); // Pastikan path benar
const UsersValidator = require("./validator/users");

// Authentications
const authentications = require("./api/authentications");
const AuthenticationsService = require("./services/database/AuthenticationsService");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationsValidator = require("./validator/authentications");

// Collaborations
const collaborations = require("./api/collaborations");
const CollaborationsService = require("./services/database/CollaborationsService");
const CollaborationsValidator = require("./validator/collaborations");

//exports
const _exports = require("./api/exports");
const ProducerService = require("./services/rabbitmq/ProducerService");
const ExportsValidator = require("./validator/exports");

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // Registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // Mendefinisikan strategi autentikasi jwt
  server.auth.strategy("notesapp_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  // Instansiasi Service
  const notesService = new NotesService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();

  // Registrasi Plugin Internal
  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: NotesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: ExportsValidator,
      },
    },
  ]);

  server.ext("onPreResponse", (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    // Penanganan error server internal (Opsional tapi disarankan agar tidak bocor infonya)
    if (response instanceof Error && !response.isBoom) {
      console.error(response); // Log error asli ke console server
      const newResponse = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
