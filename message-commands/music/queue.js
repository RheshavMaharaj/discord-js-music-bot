const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  name: 'queue',
  aliases: ["q"],
  description: 'Displays the current song queue',
  async execute(_client, player, message) {

    const guildQueue = player.getQueue(message.guild.id);

    if (guildQueue && guildQueue.tracks.length > 0) {
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

      const tracks = [...guildQueue.tracks];
      const generateEmbed = async (start, number) => {
        const current = tracks.slice(start, start + 10);

        // You can of course customise this embed however you want
        let listQueue = "```javascript\n";

        current.map(async (t, index) => {
          const title = t.title + " - " + t.author;
          listQueue += `\n${number + index}) `.padEnd(10, ' ') + title.trunc(35).padEnd(50, ' ') + t.duration;
        });

        listQueue += "```";

        return listQueue;
      };

      const canFitOnOnePage = tracks.length <= 10;
      const embedMessage = await message.channel.send({
        content: await generateEmbed(0, 1),
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
          content: await generateEmbed(currentIndex, pageNum),
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
    else {
      const commandEmbed = new MessageEmbed().setColor('#0099ff').setDescription(`The queue is empty`);
      await message.channel.send({ embeds: [commandEmbed] });
    }
  },
};