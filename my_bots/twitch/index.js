import tmi from 'tmi.js';
import { getWZStats } from '../wz/index.js';
import { db_adm_conn, getWZidForChannel } from '../db/index.mjs';

function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
   }

export var client;
export const reloadTwitchClient = async () => {
    try {
        var db_res = await db_adm_conn.query(`SELECT channel_name FROM channels`);
        var channels = []
        for (var i = 0; i < db_res.rows.length; i++) {
            channels.push(db_res.rows[i].channel_name);
        }
        client = new tmi.Client({
            options: { debug: true },
            identity: {
                username: 'CookiieZChatBot',
                password: process.env.token
            },
            channels: channels
        });
        client.connect().catch(console.error);
    } catch(err) {
        console.log('twitch error');
        console.log(err.stack);
    }
};
await reloadTwitchClient()

client.on('message', async (channel, tags, message, self) => {
    try {
        if (self) return; 
        if (!message.startsWith('!')) return;
        var args = message.split(' ')
        var command = args[0].substring('1')
        var commands_res = await db_adm_conn.query(`
        SELECT COUNT(channel_name)
        FROM channels
        JOIN commands using(channel_id)
        WHERE channel_name = '${channel}' AND command_name = '${command}'`);
        if (commands_res.rows[0].count == 0) return;
        handleCommand(command, tags, channel.substring(1), args)
    } catch (err) {
        console.log('twitch error');
        console.log(err.stack)
    }
});

const handleCommand = async (command, tags, channel, args) => {
    if (command === 'stats') {
        var out = await getWZStats(args.length > 1 ? args[1] : await getWZidForChannel(channel), args[2] ? args[2] : null)
        for (var i = 0; i < out.length; i++) {
            client.say(channel,  out[i])
            await Sleep(1500)
        }
    }
}