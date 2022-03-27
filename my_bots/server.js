import { db_adm_conn } from "./db/index.mjs";
import { reloadTwitchClient } from "./twitch/index.js";
import { client as dc } from "./discord/index.mjs";
import { router} from './spotify/index.mjs'
import Express from 'express'
import http from 'http'

const app = new Express();
const server = new http.Server(app);


app.use(Express.json({ limit: '200kb' }));
app.use(Express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    var origin = req.get('origin') || req.get('host');
    console.log(req.headers)
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Authorization, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});

app.use((req, res, next) => {
    console.log(`\n\n${req.method}: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    console.log('headers:');
    console.log(req.headers);
    console.log('body:');
    console.log(req.body);
    next();
})

app.post('/channel', async (req, res) => {
    try {
        var channel_name = req.body.channel_name
        var wz_id = req.body.wz_id || null
        if (channel_name == undefined) {
            res.sendStatus(400)
        }
        else {
            if (wz_id)    
                await db_adm_conn.query(`INSERT INTO channels (channel_name, wz_id) VALUES ('#${channel_name.toLowerCase()}', '${wz_id}')`)
            else
                await db_adm_conn.query(`INSERT INTO channels (channel_name) VALUES ('#${channel_name.toLowerCase()}')`)
            await reloadTwitchClient()
            res.sendStatus(201)
        }
    } catch(err) {
        console.log(err)
        res.status(500).send(err)
    }
})

app.post('/commands', async (req, res) => {
    try {
        var commands = req.body.commands
        var channel_name = req.body.channel_name
        if (channel_name == undefined || typeof (commands) != "object" || commands.length < 1) {
            res.sendStatus(400)
        }
        else {
            var channel_id_row = await db_adm_conn.query(`SELECT channel_id FROM channels WHERE channel_name = '#${channel_name.toLowerCase()}'`)
            if (channel_id_row.rows[0] == undefined) {
                res.sendStatus(400)
            } else {
                var qu = `INSERT INTO commands (command_name, channel_id) VALUES `
                qu += `('${commands[0]}', '${channel_id_row.rows[0].channel_id}')` 
                for (var i = 1; i < commands.length; i++) {
                    qu += `, ('${commands[i]}', '${channel_id_row.rows[0].channel_id}')` 
                }
                qu += ';'
                console.log(qu)
                await db_adm_conn.query(qu)
                res.sendStatus(201)
            }
        }
    } catch(err) {
        console.log(err)
        res.status(500).send(err)
    }
})
app.use(router)
server.listen(process.env.PORT, () => console.log(` server stated on port ${process.env.PORT}`))