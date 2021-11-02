const { MessageEmbed } = require('discord.js');
const playdl = require("play-dl");

module.exports = {
  name: 'playnext',
  aliases: ["pn"],
  description: 'Queues songs and moves them to the top of the queue to be played next',
  async execute(_client, player, message, args) {

    if (!message.member.voice.channel) return;

    const guildQueue = player.getQueue(message.guild.id);

    if (args.length !== 0 && !validURL(args[0])) {
      if (!guildQueue) { // if queue doesn't exist, create one and add songs

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

        const song = await player.search(args.join(' '), {
          requestedBy: message.member,
        }).then(x => x.tracks[0]);

        queue.play(song);

      }
      else if (message.member.voice.channelId === message.guild.me.voice.channelId) {

        const song = await player.search(args.join(' '), {
          requestedBy: message.member,
        }).then(x => x.tracks[0]);

        guildQueue.insert(song, 0);

      }
    }
    else if (validURL(args[0])) {
      if (!guildQueue) {

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

        const songs = await player.search(args.join(' '), {
          requestedBy: message.member,
        })
          .catch(/* Intentionally Left Blank Because The Link Search always errors out once*/)
          .then(x => x.tracks);
        queue.addTracks(songs);
        queue.play();

        if (songs.length > 0) {
          const commandEmbed = new MessageEmbed().setColor('#0099ff').setDescription(`Queued [${songs[0].title}](${songs[0].url}) + \`${songs.length}\` tracks`);
          await message.channel.send({ embeds: [commandEmbed] });
        }

      }
      else if (message.member.voice.channelId === message.guild.me.voice.channelId) {

        const songs = await player.search(args.join(' '), {
          requestedBy: message.member,
        })
          .catch(/* Intentionally Left Blank Because The Link Search always errors out once*/)
          .then(x => x.tracks); // multiple tracks

        guildQueue.insert(songs[0], 0);

      }
    }

    // Helper Functions
    function validURL(str) {
      const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
      return !!pattern.test(str);
    }
  },
};