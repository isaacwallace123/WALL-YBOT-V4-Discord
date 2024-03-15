const { Client, Interaction } = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async(client, interaction) => {
        await interaction.deferReply();
        const reply = await interaction.fetchReply();

        interaction.editReply(`Pong! Bot ${(reply.createdTimestamp - interaction.createdTimestamp) || 0}ms | Websocket: ${client.ws.ping}ms`);
    },

    name: 'ping',
    description: "pong",

    devOnly: false,
    testOnly: false,

    cooldown: 10,

    options: [],

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}