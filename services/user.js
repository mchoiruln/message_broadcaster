const pg = require("pg");

const db = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
// console.log(db);

const getAllUser = async () => {
  const client = await db.connect();
  try {
    return await client.query("SELECT * FROM public.users");
  } catch (error) {
    throw new Error(error);
  } finally {
    await client.release();
  }
};

const insertUser = async (
  firstname,
  lastname,
  birthday_date,
  location,
  zone
) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      'insert into users(firstname,lastname,birthday_date,"location","zone") values($1,$2,$3,$4,$5) returning *',
      [firstname, lastname, birthday_date, location, zone]
    );
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.release();
  }
};

module.exports = { db, getAllUser, insertUser };
