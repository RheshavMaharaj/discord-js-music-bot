const playdl = require("play-dl");

module.exports = {
  name: 'join',
  aliases: ["j"],
  description: 'Sweeper joins the current voice channel',
  async execute(_client, player, message) {
    if (!message.member.voice.channel) return;

    const { member, channel, guild } = message;
    const guildQueue = player.getQueue(guild.id);

    if (!guildQueue) {
      const queue = player.createQueue(guild.id, {
        leaveOnEnd: false,
        leaveOnEmpty: false,
        leaveOnStop: false,
        metadata: {
          channel: channel,
          guild: guild,
          loop: false,
        },
        async onBeforeCreateStream(track) {
          if (track.url.includes('youtube')) {
            return (await playdl.stream(track.url)).stream;
          }
          else if (track.url.includes('spotify')) {
            const songs = await player.search(track.title, {
              requestedBy: member,
            })
              .catch(/* Intentionally Left Blank Because The Link Search always errors out once*/)
              .then(x => x.tracks[0]);
            return (await playdl.stream(songs.url)).stream;
          }
        },
      });
      await queue.connect(member.voice.channel);
      await message.react("👌");
    }
    else if (guildQueue && guildQueue.connection.channel.members.size === 1) {
      await guildQueue.connect(member.voice.channel);
      await message.react("👌");
    }
  },
};