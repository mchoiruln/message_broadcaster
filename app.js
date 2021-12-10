const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (request, response, nextHandler) => {
  response.json({
    message: "Homepage!",
    info: `Served by worker with process id (PID) ${process.pid}.`,
  });
});

app.use("/", require("./routes/user"));

const server = require("http").createServer(app);

server.on("listening", () => {
  console.log(`App listening on port ${port}`, `Worker (PID) ${process.pid}.`);
});

server.listen(port);
