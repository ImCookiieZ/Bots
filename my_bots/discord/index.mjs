import { Client, Intents, MessageEmbed } from 'discord.js';
import { getWZStats } from '../wz/index.js';
export const rules_message = "861174239511969793"
export const multiplayer_message = "882721689769771038"
export const zombies_message = "882721690608607302"
export const warzone_message = "882721691443281991"
export const battlefield_message = "882721692055646229"
export const gta_message = "882721710896468018"
export const lol_message = "882745674519699466"
export const gtaRP_message = "890739365796532234"
export const rocket_message = "890742512703139930"

export const anhanger_role = "860870595558506516"
export const multiplayer_role = "882620948942045186"
export const zombies_role = "882621053048848404"
export const warzone_role = "882725871008481330"
export const battlefield_role = "882621091779072070"
export const gta_role = "882621156740448317"
export const lol_role = "882743862383231016"
export const gtaRP_role = "890737609016479825"
export const rocket_role = "890741598256775178"

export const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES ] });

client.on('ready',async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    var rolechoose = await client.channels.fetch("882618480589934593")
    await rolechoose.messages.fetch()
});

client.on('guildMemberAdd',   (member) => {
    const role = member.guild.roles.cache.find(r => r.id === anhanger_role)
    member.roles.add(role)
    const welcomeMessage = new MessageEmbed()
    .setColor('FFD700').setTitle('Welcome To N🍦Crew! - 🎮𝕣𝕠𝕝𝕖-𝕔𝕙𝕠𝕠𝕤𝕖🎮')
    .setURL('https://discord.com/channels/805230159414034482/882618480589934593')
    .setAuthor({name: "ImCookiieZz", iconURL: 'https://i.imgur.com/f4222Wk.jpeg', url: 'https://www.twitch.tv/imcookiiezz'})
    .setDescription('`Hey, pls go to the "🎮𝕣𝕠𝕝𝕖-𝕔𝕙𝕠𝕠𝕤𝕖🎮"  Channel and check for which game you are on the server ❤️ Only then you will see the channels related to the game ✌️ Have fun')
    .setFooter({text: 'Bot by ImCookiieZz'})
    member.send({embeds: [welcomeMessage]})
});

client.on('messageReactionAdd', (reactionMessage, user) => {
    if (reactionMessage.emoji.name != "✅")
        return
    let role = null
    if (reactionMessage.message.id == multiplayer_message)
        role = reactionMessage.message.guild.roles.cache.find(r => r.id === multiplayer_role)
    if (reactionMessage.message.id == zombies_message)
        role = reactionMessage.message.guild.roles.cache.find(r => r.id === zombies_role)
    if (reactionMessage.message.id == warzone_message)
        role = reactionMessage.message.guild.roles.cache.find(r => r.id === warzone_role)
    if (reactionMessage.message.id == battlefield_message)
        role = reactionMessage.message.guild.roles.cache.find(r => r.id === battlefield_role)
    if (reactionMessage.message.id == gta_message)
        role = reactionMessage.message.guild.roles.cache.find(r => r.id === gta_role)
    if (reactionMessage.message.id == gtaRP_message)
        role = reactionMessage.message.guild.roles.cache.find(r => r.id === gtaRP_role)
    if (reactionMessage.message.id == lol_message)
        role = reactionMessage.message.guild.roles.cache.find(r => r.id === lol_role)
    if (reactionMessage.message.id == rocket_message)
        role = reactionMessage.message.guild.roles.cache.find(r => r.id === rocket_role)
    if (role != null) {
        const user2 = reactionMessage.message.guild.members.cache.find(m => m.id === user.id)
        user2.roles.add(role)
    }
})

client.on('messageReactionRemove', (reactionMessage, user) => {
    if (reactionMessage.emoji.name != "✅")
        return
    let role = null
    if (reactionMessage.message.id == multiplayer_message)
        role = reactionMessage.message.guild.roles.cache.find(r => r.id === multiplayer_role)
    if (reactionMessage.message.id == zombies_message)
        role = reactionMessage.message.guild.roles.cache.find(r => r.id === zombies_role)
    if (reactionMessage.message.id == warzone_message)
        role = reactionMessage.message.guild.roles.cache.find(r => r.id === warzone_role)
    if (reactionMessage.message.id == battlefield_message)
        role = reactionMessage.message.guild.roles.cache.find(r => r.id === battlefield_role)
    if (reactionMessage.message.id == gta_message)
        role = reactionMessage.message.guild.roles.cache.find(r => r.id === gta_role)
    if (reactionMessage.message.id == gtaRP_message)
        role = reactionMessage.message.guild.roles.cache.find(r => r.id === gtaRP_role)
    if (reactionMessage.message.id == lol_message)
        role = reactionMessage.message.guild.roles.cache.find(r => r.id === lol_role)
    if (reactionMessage.message.id == rocket_message)
        role = reactionMessage.message.guild.roles.cache.find(r => r.id === rocket_role)
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
        handleCommand(command, args, message.channel)
    } catch (err) {
        console.log('discord error');
        console.log(err.stack)
    }
});

const handleCommand = async (command, args, channel) => {
if (command === 'stats' && args.length > 1) {
    var out = await getWZStats(args[1], args[2] ? args[2] : null)
    for (var i = 0; i < out.length; i++) {
        channel.send(out[i])
    }
}
}

client.login(process.env.BOTTOKEN);