const { MessageEmbed } = require('discord.js');
const lyricsParse = require("lyrics-finder");

module.exports = {
  name: 'lyrics',
  aliases: ["lr"],
  description: 'Sends the lyrics for the current track',
  async execute(_client, player, message) {

    const guildQueue = player.getQueue(message.guild.id);

    if (guildQueue && message.member.voice.channelId === message.guild.me.voice.channelId) {

      const track = guildQueue.nowPlaying();

      const embed = new MessageEmbed()
        .setAuthor(track.title)
        .setColor('#0099ff')
        .setTimestamp();

      try {
        const songNameFormated = track.title
          .toLowerCase()
          .replace(/\(lyrics|lyric|official music video|audio|official|official video|official video hd|clip officiel|clip|extended|hq|live|performance|vevo\)/g, "")
          .split(" ").join(" ");

        console.log(songNameFormated);

        let lyrics = await lyricsParse(songNameFormated, track.author) || "Not Found!";

        if (lyrics.length > 2040) {
          lyrics = "The lyrics exceeded the character limit, try searching online instead <:animeaoi:819674403322986529>";
        }
        else if (!lyrics.length) {
          console.log("error");
        }

        embed.setDescription(lyrics);
        message.channel.send({ embeds: [embed] });

      }
      catch (e) {
        console.log(e);
      }
    }

  },
};