const mongo = require('../../modules/database');
const { prefix } = require('../../config.json');
module.exports = async (client) => {
  client.user.setPresence({
    status: "online",
    activities: [
      {
        name: `${prefix}help`,
        type: 'LISTENING',
      },
    ],
  });
  console.log("Status: " + '\u001b[' + 36 + 'm' + 'Client Online' + '\u001b[0m');
  console.log("Client Connection: " + '\u001b[' + 36 + 'm' + `ID: ${client.user.id} || USER: ${client.user.username}` + '\u001b[0m');
  await mongo().then(async mongodb => {
    try {
      const wait = require('util').promisify(setTimeout);
      await wait(500).then(console.log("Connected to MongoDB Atlas Cluster" + '\u001b[' + 33 + 'm' + ` @ ` + '\u001b[0m' + '\u001b[' + 32 + 'm' + `\`${mongodb.connection.host}\`` + '\u001b[0m'));
      await wait(500).then(console.log("Connected on Port: " + '\u001b[' + 93 + 'm' + mongodb.connection.port + '\u001b[0m'));
      await wait(500).then(console.log("Connected to Atlas Database: " + '\u001b[' + 32 + 'm' + mongodb.connection.name + '\u001b[0m'));
    }
    catch (e) {
      console.log(e);
    }
  });
};