const { MessageSelectMenu, MessageEmbed, MessageActionRow } = require('discord.js');
const playdl = require("play-dl");

module.exports = {
  name: 'search',
  aliases: ["find"],
  description: "Searches for the songs and let's you choose from the search result",
  async execute(client, player, message, args) {
    if (!message.member.voice.channel) return;

    const guildQueue = player.getQueue(message.guild.id);

    const templist = [];
    let count = 0;

    if (args.length !== 0 && !validURL(args[0])) {
      if (!guildQueue) { // if queue doesn't exist, create one and add songs

        const res = await player.search(args.join(' '), {
          requestedBy: message.member,
        });

        if (!res || !res.tracks.length) return message.channel.send(`No results found ${message.author}`);

        const maxTracks = res.tracks.slice(0, 10);

        for (const track of maxTracks) {
          const dict = {
            "label": track.title,
            "description": track.author,
            "value": `${count}`,
            "emoji": "🎶",
          };
          templist.push(dict);
          count++;
        }

        const embed = new MessageEmbed()
          .setColor('#0099ff')
          .setAuthor(`Results for ${args.join(' ')}`, client.user.displayAvatarURL({ size: 1024, dynamic: true }))
          .setDescription(`${maxTracks.map((track, i) => `**${i + 1}**.`.padEnd(3, ' ') + ` [${track.title}](${track.url})`).join('\n')}\n\nSelect your choice below`)
          .setTimestamp();

        const selectorRow = new MessageActionRow()
          .addComponents(
            new MessageSelectMenu()
              .setCustomId('select')
              .setPlaceholder('Nothing selected')
              .addOptions(
                templist,
              ),
          );

        message.channel.send({ embeds: [embed], components: [selectorRow] });

        const collector = message.channel.createMessageComponentCollector({
          time: 15000,
          errors: ['time'],
          filter: i => i.member.id === message.author.id,
          componentType: 'SELECT_MENU',
        });

        collector.on('collect', async i => {
          const commandEmbed = new MessageEmbed().setColor('#0099ff').setDescription("Request Fulfilled!");
          await i.update({ embeds: [commandEmbed] });

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

          const track = res.tracks[parseInt(i.values[0])];
          queue.addTrack(track);

          queue.play();
          collector.stop();

        });
      }
      else if (message.member.voice.channelId === message.guild.me.voice.channelId) {

        const res = await player.search(args.join(' '), {
          requestedBy: message.member,
        });

        if (!res || !res.tracks.length) return message.channel.send(`No results found ${message.author}`);

        const maxTracks = res.tracks.slice(0, 10);

        for (const track of maxTracks) {
          const dict = {
            "label": track.title,
            "description": track.author,
            "value": `${count}`,
            "emoji": "🎶",
          };
          templist.push(dict);
          count++;
        }

        const embed = new MessageEmbed()
          .setColor('#0099ff')
          .setAuthor(`Results for ${args.join(' ')}`, client.user.displayAvatarURL({ size: 1024, dynamic: true }))
          .setDescription(`${maxTracks.map((track, i) => `**${i + 1}**.`.padEnd(3, ' ') + ` [${track.title}](${track.url})`).join('\n')}\n\nSelect your choice below`)
          .setTimestamp();

        const selectorRow = new MessageActionRow()
          .addComponents(
            new MessageSelectMenu()
              .setCustomId('select')
              .setPlaceholder('Nothing selected')
              .addOptions(
                templist,
              ),
          );

        message.channel.send({ embeds: [embed], components: [selectorRow] });

        const collector = message.channel.createMessageComponentCollector({
          time: 15000,
          errors: ['time'],
          filter: i => i.member.id === message.author.id,
          componentType: 'SELECT_MENU',
        });

        collector.on('collect', async i => {
          const commandEmbed = new MessageEmbed().setColor('#0099ff').setDescription("Request Fulfilled!");
          await i.update({ embeds: [commandEmbed] });

          const track = res.tracks[parseInt(i.values[0])];
          guildQueue.addTrack(track);
          collector.stop();

        });
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