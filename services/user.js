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

const insertUser = async ({
  firstname,
  lastname,
  birthday_date,
  location,
  zone,
}) => {
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

const deleteUser = async (id) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query("delete from public.users where id=$1", [
      id,
    ]);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.release();
  }
};

const updateUser = async ({
  firstname,
  lastname,
  birthday_date,
  location,
  zone,
  id,
  last_updated_lock,
}) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      `update users 
      set firstname=$1,
       lastname=$2,
       birthday_date=$3,
      "location"=$4,
      "zone"=$5
      where id=$6 and last_updated_lock=$7
      returning *`,
      [
        firstname,
        lastname,
        birthday_date,
        location,
        zone,
        id,
        last_updated_lock,
      ]
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

const getUser = async (id) => {
  const client = await db.connect();
  try {
    return await client.query("SELECT * FROM public.users where id=$1", [id]);
  } catch (error) {
    throw new Error(error);
  } finally {
    await client.release();
  }
};

module.exports = {
  db,
  getAllUser,
  insertUser,
  deleteUser,
  updateUser,
  getUser,
};
