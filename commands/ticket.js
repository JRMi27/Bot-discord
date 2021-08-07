    fs = require('fs'),
    Discord = require('discord.js')
    config = require('../config.json')

  module.exports = {
    run: async (message, args, client) => {
        const channel = await message.guild.channels.create(` ${message}`);
        
      channel.setParent("872235445768052768");

      channel.updateOverwrite(message.guild.id, {
        SEND_MESSAGE: false,
        VIEW_CHANNEL: false,
      });
      channel.updateOverwrite(message.author, {
        SEND_MESSAGE: true,
        VIEW_CHANNEL: true,
      });

        channel.send(new Discord.MessageEmbed()
            .addField(`Molka | Support `, ` Bonjour ${message.author} – ceci est une réponse automatique :
                S'il vous plaît, veuillez nous communiquer de la manière la plus précise et complète possible votre plainte, problème ou question.

                **COMMENT FORMULER UN TICKET PRÉCIS ?**
                **•** expliquer la nature du problème.
                **•** attacher un screen et/ou record si nécessaire.

                Merci de patienter le temps qu'un membre de l'équipe soit en mesure de vous aider.`, true))
                const reactionMessage = await channel.send("Merci d'avoir contacté le support de Molka!");

    try {
      await reactionMessage.react("🔒");
      await reactionMessage.react("🔓");
      await reactionMessage.react("⛔");
    } catch (err) {
      channel.send("Erreur lors de l'envoi des emojis !");
      throw err;
    }

    const collector = reactionMessage.createReactionCollector(
      (reaction, user) => message.guild.members.cache.find((member) => member.id === user.id).hasPermission("ADMINISTRATOR"),
      { dispose: true }
    );

    collector.on("collect", (reaction, user) => {
      switch (reaction.emoji.name) {
        case "🔒":
          channel.updateOverwrite(message.author, { SEND_MESSAGES: false });
          break;
        case "🔓":
          channel.updateOverwrite(message.author, {SEND_MESSAGES: true });
          break;
        case "⛔":
          channel.send("Suppression de ce ticket dans 5 secondes !");
          setTimeout(() => channel.delete(), 5000);
          break;
      }
    });

    message.channel
      .send(`Voici votre ticket : ${channel}`)
      .then((msg) => {
        setTimeout(() => msg.delete(), 7000);
        setTimeout(() => message.delete(), 3000);
      })
      .catch((err) => {
        throw err;
      });
    },
    name: 'ticket',
    guildOnly: true
}

