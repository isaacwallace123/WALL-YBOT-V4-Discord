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
            await interaction.reply({ content: `There are no songs to skip.`, ephemeral: true });
            return;
        }

        const currentSong = queue.current;

        queue.skip();

        await interaction.reply({embeds: [
            new EmbedBuilder()
                .setDescription(`Skipped **${currentSong.title}**`)
                .setThumbnail(currentSong.thumbnail)
        ]});
    },

    name: 'skip',
    description: 'Skip the next song.',

    devOnly: true,
    testOnly: false,

    options: [],

    permissionsRequired: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],
    botPermissions: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],

    deleted: false,
}