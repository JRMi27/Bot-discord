const Discord = require('discord.js'),
    client = new Discord.Client({
        fetchAllMembers: true,
        disableEveryone: true,
    }),
    config = require('./config.json'),
    fs = require('fs')
 
client.login(config.token)
client.commands = new Discord.Collection()
client.db = require('./db.json')
client.warning = require ('./warning.json')

fs.readdir('./commands', (err, files) => {
    if (err) throw err
    files.forEach(file => {
        if (!file.endsWith('.js')) return
        const command = require(`./commands/${file}`)
        client.commands.set(command.name, command)
    })
})
 
client.on('message', message => {
    if (message.type !== 'DEFAULT' || message.author.bot) return
    
    if (!message.member.hasPermission('MANAGE_CHANNELS') && client.db.lockedChannels.includes(message.channel.id)) return message.delete()
    
    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    if (!commandName.startsWith(config.prefix)) return
    const command = client.commands.get(commandName.slice(config.prefix.length))
    if (!command) return
    command.run (message, args, client)
})

client.on('channelCreate', channel => {
    if (!channel.guild) returns
    const muteRole = channel.guild.roles.cache.find(role => role.name === 'Muted')
    if (!muteRole) return
    channel.createOverwrite(muteRole, {
        SEND_MESSAGES: false,
        CONNECT: false,
        ADD_REACTIONS: false
    })
})
client.on('ready', () => {
    const statuses = [
        () => `Molka RP`,
        () => `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} utilisateurs`
    ]
    let i = 0
    setInterval(() => {
        client.user.setActivity(statuses[i](), {type: 'PLAYING'})
        i = ++i % statuses.length
    }, 1e4)
    setInterval(() => {
        const [bots, humans] = client.guilds.cache.first().members.cache.partition(member => member.user.bot)
        client.channels.cache.get(config.serverStats.humans).setName(`Membre : ${humans.size}`)
        client.channels.cache.get(config.serverStats.bots).setName(`🤖 Bots : ${bots.size}`)
        client.channels.cache.get(config.serverStats.total).setName(`Total : ${client.guilds.cache.first().memberCount}`)
    }, 3e4)
})


const keepAlive = require('./server.js');

keepAlive();
client.login(process.env.TOKEN);

client.on("ready", ()=>console.log("READY"));

const jointocreate = require("./jointocreate");
const ticket = require('./commands/ticket')
jointocreate(client);


client.login(process.env.TOKEN);

