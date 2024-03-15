const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction
     */

    callback: async(client, interaction) => {
        const queue = await client.player.getQueue(interaction.guild);

        if (!queue) { // || !queue.playing
            await interaction.reply({ content: `There are no songs in queue.`, ephemeral: true });
            return;
        }

        const queueString = queue.tracks.slice(0,10).map((song, i) => {
            return `${i + 1})  [${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`;
        }).join("\n");

        const currentSong = queue.current;

        await interaction.reply({embeds: [
            new EmbedBuilder()
                .setDescription(`**Currently Playing:**\n\` ${currentSong.title} - <@${currentSong.requestedBy.id}>\n\n**Queue:**\n${queueString}`)
                .setThumbnail(currentSong.thumbnail)
        ]});
    },

    name: 'queue',
    description: 'View the queue',

    devOnly: true,
    testOnly: false,

    options: [],

    permissionsRequired: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],
    botPermissions: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],

    deleted: false,
}