const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const { Player } = require("discord-player");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.GUILD_INVITES,
  ],
  partials: [
    'MESSAGE',
    'CHANNEL',
    'REACTION',
  ],
});
global.client = client;

// Initialising music player
const player = new Player(client, {
  ytdlOptions: {
    quality: 'highestaudio',
    highWaterMark: 1 << 25,
  },
});

client.events = new Collection(); // Client Events
client.messageCommands = new Collection(); // messageCreate based commands
client.aliases = new Collection(); // messageCreate based command aliases
client.musicCommands = new Collection(); // Command helper collection

// Requiring all handlers which in turn require commands and events
['event-handlers', 'command-handlers', 'command-helpers', 'player-event-handler'].forEach(handler => {
  require(`./handlers/${handler}`)(client, player);
});

process.on("unhandledRejection", err => {
  console.error('\u001b[' + 33 + 'm' + "Error: " + '\u001b[0m' + err.message);
});

process.on("uncaughtException", err => {
  console.error(err);
});

client.login(token);