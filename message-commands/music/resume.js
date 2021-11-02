module.exports = {
  name: 'resume',
  aliases: ["r"],
  description: 'Resumes the queue if it is paused',
  async execute(_client, player, message) {
    const guildQueue = player.getQueue(message.guild.id);

    if (guildQueue) {

      guildQueue.setPaused(false);
      message.react("👌");

    }
  },
};