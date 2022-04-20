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
    console.log(rows.rows)
    return rows.rows[0].wz_id
}

export const add_tokens = async (access_token, refresh_token, expires_in, service_name,  channel_id) => {
    var expires_at = Math.round(((new Date()).getTime() - 2) / 1000) + expires_in
    try {
        await db_adm_conn.query(`DELETE FROM tokens WHERE service_name = '${service_name}' and channel_id = '${channel_id}'`)
        await db_adm_conn.query(`INSERT INTO tokens (access_token, expires_at, refresh_token, service_name, channel_id) VALUES ('${access_token}', '${expires_at}', '${refresh_token}', '${service_name}', '${channel_id}')`)
        return true
    } catch (err) {
        console.log(err)
        return false
    }

}

export const update_tokens = async (access_token, refresh_token, expires_at) => {
    await db_adm_conn.query(`
            UPDATE tokens
            SET (access_token, expires_at) = ('${access_token}', '${expires_at}')
            WHERE refresh_token = '${refresh_token}'`)
}


export const get_access_token = async (service, channel_name) => {
    var res = await db_adm_conn.query(`
    SELECT access_token
    FROM tokens t
    JOIN channels c using(channel_id)
    WHERE c.channel_name = '#${channel_name}' 
        AND t.service_name = '${service}'`)
    if (res.rows.length == 0)
        return null
    return res.rows[0].access_token
}

export const get_refresh_token = async (service, channel_name) => {
    var res = await db_adm_conn.query(`
    SELECT refresh_token
    FROM tokens t
    JOIN channels c using(channel_id)
    WHERE c.channel_name = '#${channel_name}' 
        AND t.service_name = '${service}'`)
    if (res.rows.length == 0)
        return null
    return res.rows[0].refresh_token
}

export const get_role = async (message_id) => {
    var res = await db_adm_conn.query(`SELECT role_dc_id FROM roles WHERE role_message = '${message_id}'`)
    if (res.rowCount > 0)
        return res.rows[0].role_dc_id
    return null
}

export const create_role = async (message_id, role_name, role_dc_id) => {
    await db_adm_conn.query(`INSERT INTO roles 
    (
        role_name, 
        role_message, 
        role_dc_id
    ) VALUES 
    ('${role_name}', '${message_id}', '${role_dc_id}');`)
}