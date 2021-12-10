const mock_data = require("./MOCK_DATA.json");

const random1to1000 = (MIN_NUMBER, MAX_NUMBER) =>
  Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;

module.exports = function (requestId) {
  // this object will be serialized to JSON and sent in the body of the request

  // const len = requestId.length;
  // const f = requestId.substr(0, len / 2);
  // const l = requestId.substr(len / 2);

  // return {
  //   birthday_date: "1985-12-14",
  //   firstname: f,
  //   lastname: l,
  //   location: "-37.97836770676087, 145.10293555449056",
  // };
  return mock_data[random1to1000(1, 1000)];
};
