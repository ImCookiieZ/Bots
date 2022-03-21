import pg from 'pg'

const Client = pg.Client;
const connectionString = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;
export let db_adm_conn;

db_adm_conn = new Client({
    connectionString,
});

db_adm_conn.connect();

export const getWZidForChannel = async (channel_name) => {
    var rows = await db_adm_conn.query(`SELECT wz_id from channels WHERE channel_name = '#${channel_name}'`)
    return rows.rows[0].wz_id
}