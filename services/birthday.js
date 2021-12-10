import pg from "pg";

const db = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
// console.log(db);

const getBirthdayUser = async (scheduled) => {
  const client = await db.connect();
  try {
    console.log({ scheduled });
    return await client.query(
      "SELECT * FROM public.users where scheduled=$1 and (scheduled + '1 hour'::interval > now()) and status='UNCELEBRATED'",
      [scheduled]
    );
  } catch (error) {
    throw new Error(error);
  } finally {
    await client.release();
  }
};

const updateStatusUser = async ({ status, id, last_updated_lock }) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      "UPDATE public.users set status=$3 where id=$1 and last_updated_lock=$2 returning *",
      [id, last_updated_lock, status]
    );
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw new Error(error);
  } finally {
    await client.release();
  }
};

// get all users that scheduled has more than one hour behind from now() of server
const getLateBirthdayUser = async (scheduled) => {
  const client = await db.connect();
  try {
    return await client.query(
      "SELECT * FROM public.users where scheduled < now() - '1 hours'::interval and status='UNCELEBRATED'"
    );
  } catch (error) {
    throw new Error(error);
  } finally {
    await client.release();
  }
};
export { db, getBirthdayUser, updateStatusUser, getLateBirthdayUser };
