const hapi = require("@hapi/hapi");
const routes = require("./routes");

const init = async () => {
  const server = hapi.server({
    port: 5001,
    host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
    routes: {
      cors: {
        origin: ["https://notesapp-v1.dicodingacademy.com"],
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
