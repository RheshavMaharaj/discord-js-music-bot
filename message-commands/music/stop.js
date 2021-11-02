const playdl = require("play-dl");

module.exports = {
  name: 'stop',
  aliases: ["halt", "leave"],
  description: 'Stops the queue and triggers the bot to leave the voice chat',
  async execute(_client, player, message) {

    const guildQueue = player.getQueue(message.guild.id);


    if (guildQueue && message.member.voice.channelId === message.guild.me.voice.channelId) {
      message.react('😶');
      guildQueue.destroy({ disconnect: true });
    }
    else if (!guildQueue && message.member.voice.channelId === message.guild.me.voice.channelId) {
      player.deleteQueue(message.guild);
      const queue = player.createQueue(message.guild.id, {
        leaveOnEnd: false,
        leaveOnEmpty: false,
        leaveOnStop: false,
        metadata: {
          channel: message.channel,
          guild: message.guild,
          loop: false,
        },
        async onBeforeCreateStream(track) {
          if (track.url.includes('youtube')) {
            return (await playdl.stream(track.url)).stream;
          }
          else if (track.url.includes('spotify')) {
            const songs = await player.search(track.title, {
              requestedBy: message.member,
            })
              .catch(/* Intentionally Left Blank Because The Link Search always errors out once*/)
              .then(x => x.tracks[0]);
            return (await playdl.stream(songs.url)).stream;
          }
        },
      });
      await queue.connect(message.member.voice.channel);
      queue.destroy({ disconnect: true });
      message.react('👋');

    }
    else {
      message.react('❌');
    }

  },
};