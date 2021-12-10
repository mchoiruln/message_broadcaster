import express from "express";
import { createServer } from "http";
import routeUser from "./routes/user.js";

export default function () {
  const app = express();
  const port = process.env.PORT || 3000;

  app.get("/", (request, response, nextHandler) => {
    response.json({
      message: "Homepage!",
      info: `Served by worker with process id (PID) ${process.pid}.`,
    });
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/", routeUser);

  const server = createServer(app);

  server.on("listening", () => {
    console.log(
      `App listening on port ${port}`,
      `Worker (PID) ${process.pid}.`
    );
  });

  server.listen(port);
}
