const cluster = require("cluster");
const os = require("os");
const dotenv = require("dotenv");
dotenv.config();

if (cluster.isMaster) {
  // Take advantage of multiple CPUs
  const cpus = os.cpus().length;

  console.log(`Taking advantage of ${cpus} CPUs`);
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }
  //  see output from workers
  console.dir(cluster.workers, { depth: 0 });

  cluster.on("exit", (worker, code) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.warn(
        `\x1b[34mWorker ${worker.process.pid} crashed.\nStarting a new worker...\n\x1b[0m`
      );
      const nw = cluster.fork();
      console.warn(`\x1b[32mWorker ${nw.process.pid} will replace him \x1b[0m`);
    }
  });

  console.log(`Master PID: ${process.pid}`);
} else {
  // how funny, this is all needed for workers to start
  require("./app.js");
}
