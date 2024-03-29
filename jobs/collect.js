import { parentPort } from "worker_threads";
import { DateTime } from "luxon";
import axios from "axios";
import https from "https";
import { getBirthdayUser, updateStatusUser } from "../services/birthday.js";

import pThrottle from "p-throttle";

// initialize throttle options
const throttle = pThrottle({
  limit: 1, // x request
  interval: 1000 * 1, // per x s
});

const sendHappyBirthday = throttle(async (r) => {
  const message = `Hey, ${r.firstname + " " + r.lastname} it’s your birthday`;

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

    if (response && response.status === 200) {
      const result = await updateStatusUser({
        status: "CELEBRATED",
        id: r.id,
        last_updated_lock: r.last_updated_lock,
      });
      console.log({ rows_collect: result.rows });
    }
    console.log(message, response.data);
    return Promise.resolve();
  } catch (error) {
    console.log(error.message);
    return Promise.reject(error);
  }
});

import pRetry from "p-retry";

const runJob = async () => {
  try {
    const { year, month, day, hour } = DateTime.now().setZone("UTC").toObject();
    const result = await getBirthdayUser(
      DateTime.fromObject({
        year,
        month,
        day,
        hour,
        minutes: 0,
        seconds: 0,
      }).toISO()
    );
    console.log({ rows_collect: result.rowCount });

    const asyncRes = await Promise.all(
      result.rows.map(async (r) => {
        await sendHappyBirthday(r);
      })
    );
    return Promise.resolve();
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

(async () => {
  await pRetry(runJob, {
    onFailedAttempt: (error) => {
      console.log(
        `Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`
      );
    },
    retries: 5,
  });
  // signal to parent that the job is done
  if (parentPort) parentPort.postMessage("done");
  else process.exit(0);
})();
