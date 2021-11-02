const { QueueRepeatMode } = require("discord-player");

module.exports = {
  name: 'loop',
  aliases: ["l"],
  description: 'Either loops the queue or the song',
  async execute(_client, player, message, args) {

    const guildQueue = player.getQueue(message.guild.id);

    if (guildQueue && message.member.voice.channelId === message.guild.me.voice.channelId) {
      if (args[0] === "song") {
        message.react('🔂');
        guildQueue.setRepeatMode(QueueRepeatMode.TRACK); // Turning loop on for currenttly playing track
      }
      if (args[0] === "off") {
        message.react('🔂');
        guildQueue.setRepeatMode(QueueRepeatMode.OFF); // Taking loop off for specifically a song
      }
      else if (args.length === 0 && !guildQueue.metadata.loop) {
        message.react('🔁');
        guildQueue.metadata.loop = true; // Setting loop for Queue
      }
      else if (args.length === 0 && guildQueue.metadata.loop) {
        message.react('🔁');
        guildQueue.setRepeatMode(QueueRepeatMode.OFF); // Loop off for all types
        guildQueue.metadata.loop = false;
      }
    }

  },
};