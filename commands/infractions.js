const moment = require('moment'),
    Discord = require('discord.js')
 
moment.locale('fr')
 
module.exports = {
    run: async (message, args, client) => {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande.')
        const member = message.mentions.members.first()
        if (!member) return message.channel.send('Veuillez mentionner le membre dont voir les warns.')
        if (!client.warning.warns[member.id]) return message.channel.send('Ce membre n\'a aucun warn.')
        message.channel.send(new Discord.MessageEmbed()
            .setDescription(`**Total de warns :** ${client.warning.warns[member.id].length}\n\n__**10 derniers warns**__\n\n${client.warning.warns[member.id].slice(0, 10).map((warn, i) => `**${i + 1}.** ${warn.reason}\nSanctionné ${moment(warn.date).fromNow()} par <@!${warn.mod}>`).join('\n\n')}`))
    },
    name: 'infractions',
    guildOnly: true
}