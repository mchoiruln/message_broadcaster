const Bree = require("bree");
const Cabin = require("cabin");
const Graceful = require("@ladjs/graceful");
const { Signale } = require("signale");

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
      cron: "0 * * * *", // every hour
    },
  ],
});

// handle graceful reloads, pm2 support, and events like SIGHUP, SIGINT, etc.
const graceful = new Graceful({ brees: [bree] });
graceful.listen();

console.log(new Date());
// start all jobs (this is the equivalent of reloading a crontab):
bree.start();
