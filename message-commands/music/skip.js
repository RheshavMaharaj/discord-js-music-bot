module.exports = {
  name: 'skip',
  aliases: ["next"],
  description: 'Skips the currently playing song',
  async execute(_client, player, message) {

    const guildQueue = player.getQueue(message.guild.id);

    if (guildQueue && message.member.voice.channelId === message.guild.me.voice.channelId) {
      guildQueue.skip();
      message.react('👌');
    }
    else {
      message.react('❌');
    }

  },
};