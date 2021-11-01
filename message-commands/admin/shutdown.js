const mongoose = require("mongoose");
const { owner } = require('../../config.json');
module.exports = {
  name: 'shutdown',
  aliases: ["off"],
  description: 'turns the bot off and stops the process',
  async execute(client, _player, message) {
    if (message.author.id === owner) {
      message.channel.send("```diff\n--- init shutdown\n! Shutting Down\n- Logging Out\n- Closing MongoDB Atlas Connection```").then(() => {
        client.destroy();
        console.log("Successfully Logged Out");
        mongoose.connection.close().then(console.log("Successfully Closed MongoDB Connection"));
        process.exit();
      });
    }
  },
};