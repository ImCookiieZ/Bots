import tmi from 'tmi.js';
import ComfyJS from 'comfy.js';
import { getWZStats } from '../wz/index.js';
import { db_adm_conn, getWZidForChannel } from '../db/index.mjs';
import { addSongToQueue, skipSong } from '../spotify/commands.js';

const handleCommand = async (command, channel, args) => {
    if (command === 'stats') {
        var out = await getWZStats(args.length > 1 ? args[1] : await getWZidForChannel(channel), args[2] ? args[2] : null)
        for (var i = 0; i < out.length; i++) {
            client.say(channel,  out[i])
            await Sleep(1500)
        }
    } else if (command === 'add') {
        var out = await addSongToQueue(channel, args[1])
        client.say(channel, out)
    } else if (command === 'skip') {
        var out = await skipSong(channel)
        client.say(channel, out)
    }
}

function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

const noAwaitSleep = (seconds) => {
    const now = Date.now() + 1000 * seconds
    while (Date.now() < now);
}

export let client;
export const reloadTwitchClient = async () => {
    try {
        var db_res = db_adm_conn.query(`SELECT channel_name FROM channels`).then(() => {
        var channels = []
        for (var i = 0; i < db_res.rows.length; i++) {
            channels.push(db_res.rows[i].channel_name);
        }
        client = new tmi.Client({
            options: { debug: false },
            identity: {
                username: 'CookiieZChatBot',
                password: process.env.TOKEN
            },
            channels: channels
        });
        client.connect().catch(console.error);
    });
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
        handleCommand(command, channel.substring(1), args)
    } catch (err) {
        console.log('twitch error');
        console.log(err.stack)
    }
});
ComfyJS.Init('imcookiiezz', process.env.TOKENCOMFY)

ComfyJS.onReward = async ( user, reward, cost, message, extra ) => {
    if (extra.reward.id === "12505b6e-4430-4f07-bbff-32d4f1673a00") {
        var out = await addSongToQueue('imcookiiezz', message.replace(/\s/g, ''))
        client.say('imcookiiezz', out)
    } else if (extra.reward.id === "2e92a927-934a-4ef9-a9a7-fb1128b4f160") {
        var out = await skipSong('imcookiiezz', message)
        client.say('imcookiiezz', out)
    }
    else console.log(extra)

}

