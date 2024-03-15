const { Client, Interaction } = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async(client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        interaction.editReply({ content: `Here is the support server for the discord bot!\n\n- https://discord.gg/hfgnKtRznk` });
    },

    name: 'support',
    description: "Get the link to the support discord server.",

    devOnly: false,
    testOnly: false,

    cooldown: 10,

    options: [],

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}