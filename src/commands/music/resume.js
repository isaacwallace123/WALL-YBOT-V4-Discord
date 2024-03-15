const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction
     */

    callback: async(client, interaction) => {
        const queue = await client.player.getQueue(interaction.guild);

        if (!queue) {
            await interaction.reply({ content: `There are no songs to resume.`, ephemeral: true });
            return;
        }

        queue.setPaused(false);

        await interaction.reply({ content: `The current song has been resumed.` });
    },

    name: 'resume',
    description: 'Resumes the current song.',

    devOnly: true,
    testOnly: false,

    options: [],

    permissionsRequired: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],
    botPermissions: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],

    deleted: false,
}