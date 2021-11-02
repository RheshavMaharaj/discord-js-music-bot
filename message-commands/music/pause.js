module.exports = {
  name: 'pause',
  aliases: ["halt", "holup"],
  description: 'Pauses the current playing song',
  async execute(_client, player, message) {

    const guildQueue = player.getQueue(message.guild.id);

    if (guildQueue && message.member.voice.channelId === message.guild.me.voice.channelId) {
      message.react('😶');
      guildQueue.setPaused(true);
    }

  },
};