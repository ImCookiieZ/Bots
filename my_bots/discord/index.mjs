import { Client, Intents, MessageEmbed } from 'discord.js';
import { getWZStats } from '../wz/index.js';
import { create_role, get_anahnger_role as get_anhaenger_role, get_role } from '../db/index.mjs';

export const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES ] });

client.on('ready',async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    var rolechoose = await client.channels.fetch("882618480589934593")
    await rolechoose.messages.fetch()
});

client.on('guildMemberAdd', async (member) => {
    const role_id = await get_anhaenger_role()
    const role = member.guild.roles.cache.find(r => r.id === role_id)
    member.roles.add(role)
    const welcomeMessage = new MessageEmbed()
    .setColor('FFD700').setTitle('Welcome To N🍦Crew! - 🎮𝕣𝕠𝕝𝕖-𝕔𝕙𝕠𝕠𝕤𝕖🎮')
    .setURL('https://discord.com/channels/805230159414034482/882618480589934593')
    .setAuthor({name: "ImCookiieZz", iconURL: 'https://i.imgur.com/f4222Wk.jpeg', url: 'https://www.twitch.tv/imcookiiezz'})
    .setDescription('`Hey, pls go to the "🎮𝕣𝕠𝕝𝕖-𝕔𝕙𝕠𝕠𝕤𝕖🎮"  Channel and check for which game you are on the server ❤️ Only then you will see the channels related to the game ✌️ Have fun')
    .setFooter({text: 'Bot by ImCookiieZz'})
    member.send({embeds: [welcomeMessage]})
});

client.on('messageReactionAdd', async (reactionMessage, user) => {
    if (reactionMessage.emoji.name != "✅")
        return
    let role_id = await get_role(reactionMessage.message.id)
    let role = reactionMessage.message.guild.roles.cache.find(r => r.id === role_id)
    if (role != null) {
        const user2 = reactionMessage.message.guild.members.cache.find(m => m.id === user.id)
        user2.roles.add(role)
    }
})

client.on('messageReactionRemove', async (reactionMessage, user) => {
    if (reactionMessage.emoji.name != "✅")
        return
    let role_id = await get_role(reactionMessage.message.id)
    let role = reactionMessage.message.guild.roles.cache.find(r => r.id === role_id)
    if (role != null) {
        const user2 = reactionMessage.message.guild.members.cache.find(m => m.id === user.id)
        user2.roles.remove(role)
    }
})

client.on('messageCreate', (message) => {
    try {
        if (!message.content.startsWith('!')) return;
        var args = message.content.split(' ')
        var command = args[0].substring('1')
        handleCommand(command, args, message.channel, message.author)
    } catch (err) {
        console.log('discord error');
        console.log(err.stack)
    }
});

const handleCommand = async (command, args, channel, author) => {
    try {
        if (command === 'stats' && args.length > 1) {
            var out = await getWZStats(args[1], args[2] ? args[2] : null)
            for (var i = 0; i < out.length; i++) {
                channel.send(out[i])
            }
        } else if (channel.name === "bot-commands🤖") {
            if (command === 'create') {
                var em = new MessageEmbed().setColor(0xfe0204).setTitle(args[1])
                var channel_to = channel.guild.channels.cache.find(c => c.id === '882618480589934593')
                var message = await channel_to.send({ embeds: [em] })
                message.react('✅')
                var role = await channel.guild.roles.create({
                      name: args[1]
                    })
                await create_role(message.id, args[1], role.id)
            }
        }
    } catch (err) {
        console.log('discord command error');
        console.log(err.stack)
    }
}

client.login(process.env.BOTTOKEN);