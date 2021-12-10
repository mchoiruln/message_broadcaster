import Bree from "bree";
import Cabin from "cabin";
import Graceful from "@ladjs/graceful";
import signale from "signale";

const { Signale } = signale;

// initialize cabin
const cabin = new Cabin({
  axe: {
    logger: new Signale(),
  },
});

const bree = new Bree({
  // logger: cabin,
  timezone: "UTC",
  jobs: [
    {
      name: "collect",
      timeout: 0,
      interval: "10s",
    },
    {
      name: "late_collect",
      timeout: 0,
      interval: "15s",
    },
  ],
});

// handle graceful reloads, pm2 support, and events like SIGHUP, SIGINT, etc.
const graceful = new Graceful({ brees: [bree] });
graceful.listen();

console.log(new Date());
// start all jobs (this is the equivalent of reloading a crontab):
bree.start();
