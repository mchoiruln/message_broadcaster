const fs = require("fs");
const path = require("path");
const { parentPort } = require("worker_threads");

const Cabin = require("cabin");
const { Signale } = require("signale");
const { DateTime } = require("luxon");
const axios = require("axios");
const https = require("https");
const { getBirthdayUser, updateStatusUser } = require("../services/birthday");

// initialize cabin
const cabin = new Cabin({
  axe: {
    logger: new Signale(),
  },
});

// store boolean if the job is cancelled
const isCancelled = false;

// handle cancellation (this is a very simple example)
if (parentPort)
  parentPort.once("message", (message) => {
    if (message === "cancel") isCancelled = true;
  });

(async () => {
  try {
    const { year, month, day, hour } = DateTime.now().setZone("UTC").toObject();
    const result = await getBirthdayUser(
      DateTime.fromObject({ year, month, day, hour }).toISO()
    );
    console.log({ rows: result.rowCount });

    const asyncRes = await Promise.all(
      result.rows.map(async (r) => {
        const message = `Hey, ${
          r.firstname + " " + r.lastname
        } it’s your birthday`;

        try {
          const agent = new https.Agent({
            rejectUnauthorized: false,
          });

          const response = await axios.post(
            process.env.HOOKBIN_URL,
            JSON.stringify({
              message,
            }),
            { httpsAgent: agent }
          );

          if (response && response.data && response.data.success) {
            const result = await updateStatusUser({
              status: "CELEBRATED",
              id: r.id,
              last_updated_lock: r.last_updated_lock,
            });
            console.log(result.rowCount);
          }
          console.log(message, response.data);
        } catch (error) {
          console.log(error.message);
        }
      })
    );
  } catch (error) {
    cabin.error(error);
  }

  // signal to parent that the job is done
  if (parentPort) parentPort.postMessage("done");
  else process.exit(0);
})();
