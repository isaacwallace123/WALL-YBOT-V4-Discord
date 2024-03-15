const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction
     */

    callback: async(client, interaction) => {
        const queue = await client.player.getQueue(interaction.guild);

        await interaction.deferReply({ ephemeral: true });

        if (!queue) {
            await interaction.editReply({ content: `There is not a queue.` });
            return;
        }

        queue.destroy();

        await interaction.editReply({ content: `Bro, do you just hate me?` });
    },

    name: 'exit',
    description: 'Exits the call.',

    devOnly: true,
    testOnly: false,

    options: [],

    permissionsRequired: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],
    botPermissions: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],

    deleted: false,
}