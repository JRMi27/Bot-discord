const fs = require('fs'),
    Discord = require('discord.js'),
    config = require('../config.json')
 
module.exports = {
    run: async (message, args, client) => {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande.')
        const member = message.mentions.members.first()
        if (!member) return message.channel.send('Veuillez mentionner le membre à unwarn.')
        if (!client.warning.warns[member.id]) return message.channel.send('Ce membre n\'a aucun warn.')
        const warnIndex = parseInt(args[1], 10) - 1
        if (warnIndex < 0 || !client.warning.warns[member.id][warnIndex]) return message.channel.send('Ce warn n\'existe pas.')
        const { reason } = client.warning.warns[member.id].splice(warnIndex, 1)[0]
        if (!client.warning.warns[member.id].length) delete client.warning.warns[member.id]
        fs.writeFileSync('./warning.json', JSON.stringify(client.warning))
        message.channel.send(`${member} a été unwarn pour ${reason} !`)
        message.guild.channels.cache.get(config.logs).send(new Discord.MessageEmbed()
            .setAuthor(`[UNWARN] ${member.user.tag}`, member.user.displayAvatarURL())
            .addField('Utilisateur', member, true)
            .addField('Modérateur', message.author, true)
            .addField('Warn supprimé', reason, true))
    },
    name: 'unwarn',
    guildOnly: true
}