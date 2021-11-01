const { MessageEmbed } = require('discord.js');

module.exports = (_client, player) => {

  player.on("trackAdd", async (queue, track) => {
    const commandEmbed = new MessageEmbed().setColor('#0099ff').setDescription(`Queued [${track.title}](${track.url})`);
    await queue.metadata.channel.send({ embeds: [commandEmbed] });
  });

  // Music Events
  player.on("trackStart", (queue, track) => {

    queue.metadata.channel.messages.fetch({ limit: 10 }).then(messages => {
      messages.forEach(message => {
        if (message.author.bot) {
          if (message.embeds.length > 0) {
            if (message.embeds[0].description && message.embeds[0].description.includes("**🎶 | Now playing**")) {
              message.delete();
            }
          }
        }
      });
    });

    const commandEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setDescription(`**🎶 | Now playing** \n\n[${track.title}](${track.url}) [${track.requestedBy}]`);
    queue.metadata.channel.send({ embeds: [commandEmbed] });

  });

  player.on("error", async (queue, error) => {
    console.log('\u001b[' + 33 + 'm' + `Queue Error: ` + '\u001b[0m' + `${error.message}`);

    if (error.message === "aborted") { // Server closes the connected
      const commandEmbed = new MessageEmbed().setColor('#0099ff').setDescription(`The Host Server has closed the connection`);
      await queue.metadata.channel.send({ embeds: [commandEmbed] });
      queue.play();
    }

    if (error.message === "Status code: 403") { // Queue stays intact
      const commandEmbed = new MessageEmbed().setColor('#0099ff').setDescription(`403 Error! Trying Again`);
      await queue.metadata.channel.send({ embeds: [commandEmbed] });
      if (queue.tracks.length === 0 && queue.previousTracks.length > 0) {
        queue.skip();
        queue.play();
      }
      else {
        queue.play();
      }
    }

    if (error.message === "Status code: 410") {
      const commandEmbed = new MessageEmbed().setColor('#0099ff').setDescription(`410 Error! Trying Again`);
      await queue.metadata.channel.send({ embeds: [commandEmbed] });
      if (queue.tracks.length === 0 && queue.previousTracks.length > 0) {
        queue.skip();
        queue.play();
      }
      else {
        queue.play();
      }
    }

    if (error.message === "[DestroyedQueue] Cannot use destroyed queue") {
      // console.log('\u001b[' + 33 + 'm' + "[ Handled Queue Destroyed Error ]" + '\u001b[0m');
      player.deleteQueue(queue.metadata.guild);
    }

    if (error.message === "write EPIPE") {
      const commandEmbed = new MessageEmbed().setColor('#0099ff').setDescription(`E-PIPE Error! Skipping`);
      await queue.metadata.channel.send({ embeds: [commandEmbed] });
      queue.skip();
      queue.play();
    }

  });

  player.on("queueEnd", async queue => {

    const queueList = queue.previousTracks;
    const uniqueTracks = [...new Set(queueList)];
    queue.addTracks(uniqueTracks);

    if (queue.metadata.loop) {
      await queue.play();
    }

  });

};