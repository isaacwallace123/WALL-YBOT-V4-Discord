require('dotenv').config();

const { emitWarning } = process;

const { Client, IntentsBitField, REST, Routes } = require('discord.js');
const mongoose = require('mongoose');
const eventHandler = require('./handlers/event-handler');
const { Player } = require("discord-player");

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates,
    ]
});

client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});

process.emitWarning = (warning, ...args) => {
	if (args[0] === 'ExperimentalWarning') {
		return;
	}

	if (args[0] && typeof args[0] === 'object' && args[0].type === 'ExperimentalWarning') {
		return;
	}

	return emitWarning(warning, ...args);
};

(async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { keepAlive: true });
        console.log("Logged Into DataBase");
        eventHandler(client);
    } catch(err) {
        console.log(err);
    }
})();

client.login(process.env.TOKEN);