const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const playlistSchema = require('../../schemas/playlist-schema');
const playdl = require("play-dl");

module.exports = {
  name: 'playlist',
  aliases: ["pl", "list"],
  description: 'Allows users to save, load, view, delete and add playlists for listening in the future. Pass either: <add>, <view>, <delete>, <load>, <list>',
  async execute(client, player, message, args) {
    if (args.length === 0) {
      const endEmbed = new MessageEmbed().setColor('#0099ff').setDescription("You forgot to pass in an option, try: =playlist [`<view>` `<add>` `<delete>` `<list>`]");
      await message.channel.reply({ embeds: [endEmbed] });
      return;
    }

    // View
    if (args[0].toLowerCase() === "view" && args.length > 1) {
      const doc = await playlistSchema.findOne({ userId: message.author.id.toString(), name: args[1] });
      if (doc) {
        list(message, doc.queue, "queue");
      }
      else {
        const endEmbed = new MessageEmbed().setColor('#0099ff').setDescription("That playlist doesn't exist!");
        await message.channel.reply({ embeds: [endEmbed] });
      }
    }

    // List
    if (args[0].toLowerCase() === "list") {
      const docs = await playlistSchema.find({ userId: message.author.id.toString() }).exec();
      if (docs) {
        list(message, docs, "list");
      }
      else {
        const endEmbed = new MessageEmbed().setColor('#0099ff').setDescription("You have no playlists!");
        await message.channel.reply({ embeds: [endEmbed] });
      }
    }

    // Add
    if (args[0].toLowerCase() === "add" && args.length > 1) {
      const value = await playlistSchema.findOne({ userId: message.author.id.toString(), name: args[1] });
      const guildQueue = player.getQueue(message.guild.id);
      if (guildQueue) {
        if (!value) {
          const uniqueTracks = [...new Set(guildQueue.previousTracks)];
          const savedQueue = JSON.parse(JSON.stringify(guildQueue.tracks.concat(uniqueTracks)));

          await new playlistSchema({
            userId: message.author.id.toString(),
            name: args[1],
            queue: savedQueue,
          }).save();

          const endEmbed = new MessageEmbed().setColor('#0099ff').setDescription(`Saved a playlist! \`${args[1]}\``);
          await message.channel.send({ embeds: [endEmbed] });
        }
        else {
          const endEmbed = new MessageEmbed().setColor('#0099ff').setDescription(`A playlist already exists by that name!`);
          await message.channel.send({ embeds: [endEmbed] });
        }
      }
    }

    // Delete
    if (args[0].toLowerCase() === "delete" && args.length > 1) {
      const value = await playlistSchema.findOne({ userId: message.author.id.toString(), name: args[1] });
      if (value) {
        await playlistSchema.deleteOne({ userId: message.author.id.toString(), name: args[1] });
        const endEmbed = new MessageEmbed().setColor('#0099ff').setDescription(`Deleted the playlist! \`${args[1]}\``);
        await message.channel.send({ embeds: [endEmbed] });
      }
      else {
        const endEmbed = new MessageEmbed().setColor('#0099ff').setDescription("That playlist doesn't exist!");
        await message.channel.send({ embeds: [endEmbed] });
      }
    }

    // Load
    if (args[0].toLowerCase() === "load" && args.length > 1) {
      const value = await playlistSchema.findOne({ userId: message.author.id.toString(), name: args[1] });
      const guildQueue = player.getQueue(message.guild.id);
      const tracks = [];
      if (value) {
        if (guildQueue) {
          const commandEmbed = new MessageEmbed().setColor('#0099ff').setDescription(`Loading the following playlist: \`${args[1]}\``);
          await message.channel.send({ embeds: [commandEmbed] });

          if (!guildQueue.playing) {
            await load(value, client, player, guildQueue, tracks);
          }
          else {
            for await (const song of value.queue) {
              const user = client.users.cache.get(song.requestedBy);
              const track = await player.search(song.url, {
                requestedBy: user,
              }).then(x => x.tracks[0]);
              tracks.push(track);
            }
            await guildQueue.addTracks(tracks);
          }

          const endEmbed = new MessageEmbed().setColor('#0099ff').setDescription(`Loaded the following playlist: \`${args[1]}\``);
          await message.channel.send({ embeds: [endEmbed] });
        }
        else {
          const commandEmbed = new MessageEmbed().setColor('#0099ff').setDescription(`Loading the following playlist: \`${args[1]}\``);
          await message.channel.send({ embeds: [commandEmbed] });

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
                  .catch(/* Intentionally Left Blank Because The Link Search always errors out once */)
                  .then(x => x.tracks[0]);
                return (await playdl.stream(songs.url)).stream;
              }
            },
          });
          await queue.connect(message.member.voice.channel);

          await load(value, client, player, queue, tracks);

          const endEmbed = new MessageEmbed().setColor('#0099ff').setDescription(`Loaded the following playlist: \`${args[1]}\``);
          await message.channel.send({ embeds: [endEmbed] });
        }
      }
      else {
        const endEmbed = new MessageEmbed().setColor('#0099ff').setDescription(`That playlist does not exist!`);
        await message.channel.send({ embeds: [endEmbed] });
      }
    }
  },
};

// Queue Loader
async function load(value, client, player, queue, tracks) {
  // Load First Song in and Play
  const user = client.users.cache.get(value.queue[0].requestedBy);
  const track = await player.search(value.queue[0].url, {
    requestedBy: user,
  }).then(x => x.tracks[0]);
  await queue.addTrack(track);
  await queue.play();

  // Then Load the rest of the songs into the queue
  value.queue.shift();
  for await (const song of value.queue) {
    const dbUser = client.users.cache.get(song.requestedBy);
    const dbTrack = await player.search(song.url, {
      requestedBy: dbUser,
    }).then(x => x.tracks[0]);
    tracks.push(dbTrack);
  }
  await queue.addTracks(tracks);
}

// Queue Viewer
async function list(message, arr, type) {
  String.prototype.trunc = function(n) { return this.substr(0, n - 1) + (this.length > n ? '...' : ''); };
  const backId = 'back';
  const forwardId = 'forward';
  const backButton = new MessageButton({
    style: 'DANGER',
    label: 'Back',
    customId: backId,
  });
  const forwardButton = new MessageButton({
    style: 'SUCCESS',
    label: 'Forward',
    customId: forwardId,
  });

  const tracks = [...arr];
  const generateEmbed = async (start, number) => {
    const current = tracks.slice(start, start + 10);

    if (type === "list") {
      // Customised section
      let listQueue = "```cpp\n";

      current.map(async (t, index) => {
        const title = t.name;
        listQueue += `\n${number + index}) `.padEnd(10, ' ') + title.trunc(35).padEnd(50, ' ');
      });

      listQueue += "```";

      return listQueue;
    }
    if (type === "queue") {
      let listQueue = "```cpp\n";

      current.map(async (t, index) => {
        const title = t.title + " - " + t.author;
        listQueue += `\n${number + index}) `.padEnd(10, ' ') + title.trunc(35).padEnd(50, ' ') + t.duration;
      });

      listQueue += "```";

      return listQueue;
    }

  };

  const canFitOnOnePage = tracks.length <= 10;
  const embedMessage = await message.channel.send({
    content: await generateEmbed(0, 1, type),
    components: canFitOnOnePage
      ? []
      : [new MessageActionRow({ components: [forwardButton] })],
  });

  if (canFitOnOnePage) return;

  const collector = embedMessage.createMessageComponentCollector({
    filter: i => (i.customId === 'back' || i.customId === 'forward'),
  });

  let currentIndex = 0;
  let pageNum = 1;
  collector.on('collect', async interaction => {
    // Increase/decrease index
    interaction.customId === backId ? (currentIndex -= 10) : (currentIndex += 10);
    interaction.customId === backId ? (pageNum -= 10) : (pageNum += 10);
    // Respond to interaction by updating message with new embed
    await interaction.update({
      content: await generateEmbed(currentIndex, pageNum, type),
      components: [
        new MessageActionRow({
          components: [
            // back button if it isn't the start
            ...(currentIndex ? [backButton] : []),
            // forward button if it isn't the end
            ...(currentIndex + 10 < tracks.length ? [forwardButton] : []),
          ],
        }),
      ],
    });
  });
}