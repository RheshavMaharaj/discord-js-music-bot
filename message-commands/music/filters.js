module.exports = {
  name: 'filter',
  aliases: ["fl"],
  description: 'Adds a filter to the song',
  async execute(_client, player, message, args) {

    const guildQueue = player.getQueue(message.guild.id);

    if (guildQueue && message.member.voice.channelId === message.guild.me.voice.channelId) {
      if (args[0] === 'vaporwave') {
        await guildQueue.setFilters({
          vaporwave: !guildQueue.getFiltersEnabled().includes("vaporwave"),
        });
        message.react('👌');
      }

      if (args[0] === 'nightcore') {
        await guildQueue.setFilters({
          nightcore: !guildQueue.getFiltersEnabled().includes("nightcore"),
        });
        message.react('👌');
      }

      if (args[0] === '8D') {
        await guildQueue.setFilters({
          "8D": !guildQueue.getFiltersEnabled().includes("8D"),
        });
        message.react('👌');
      }
      if (args[0] === 'bassboost') {
        await guildQueue.setFilters({
          "bassboost_low": !guildQueue.getFiltersEnabled().includes("bassboost_low"),
          normalizer2: !guildQueue.getFiltersEnabled().includes("bassboost_low"),
        });
        message.react('👌');
      }
      if (args[0] === 'tremolo') {
        await guildQueue.setFilters({
          tremolo: !guildQueue.getFiltersEnabled().includes("tremolo"),
        });
        message.react('👌');
      }
      if (args[0] === 'surrounding') {
        await guildQueue.setFilters({
          surrounding: !guildQueue.getFiltersEnabled().includes("surrounding"),
        });
        message.react('👌');
      }
      if (args[0] === 'subboost') {
        await guildQueue.setFilters({
          subboost: !guildQueue.getFiltersEnabled().includes("subboost"),
        });
        message.react('👌');
      }
      if (args[0] === 'treble') {
        await guildQueue.setFilters({
          treble: !guildQueue.getFiltersEnabled().includes("treble"),
        });
        message.react('👌');
      }
      if (args[0] === 'reverse') {
        await guildQueue.setFilters({
          reverse: !guildQueue.getFiltersEnabled().includes("reverse"),
        });
        message.react('👌');
      }
      if (args[0] === 'phaser') {
        await guildQueue.setFilters({
          phaser: !guildQueue.getFiltersEnabled().includes("phaser"),
        });
        message.react('👌');
      }
      if (args[0] === 'dim') {
        await guildQueue.setFilters({
          dim: !guildQueue.getFiltersEnabled().includes("dim"),
        });
        message.react('👌');
      }

    }

  },
};