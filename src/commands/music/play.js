const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { QueryType } = require("discord-player");

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction
     */

    callback: async(client, interaction) => {
        if (!interaction.member.voice.channel) {
            await interaction.reply({ content: "You must be in a voice channel to use this command.", ephemeral: true });
            return;
        }

        let queue = await client.player.getQueue(interaction.guild);

        if (!queue) {
            queue = await client.player.createQueue(interaction.guild);
        }

        if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        
        const song = interaction.options.get('song').value;

        const result = await client.player.search(song, {
            requestedBy: interaction.user,
            searchEngine: QueryType.YOUTUBE_SEARCH,
        });

        if (result.tracks.length === 0) {
            await interaction.reply({ content: "No results were found for that song", ephemeral: true });
            return;
        }

        const chosenSong = result.tracks[0];
        await queue.addTrack(chosenSong);

        let embed = new EmbedBuilder()
            .setDescription(`Added **[${chosenSong.title}](${chosenSong.url})** to the queue.`)
            .setThumbnail(chosenSong.thumbnail)
            .setFooter({text: `Duration: ${chosenSong.duration}`});

        if(!queue.playing) await queue.play();

        await interaction.reply({
            embeds: [embed]
        });
    },

    name: 'play',
    description: 'Play some music.',

    devOnly: true,
    testOnly: false,

    options: [
        {
            name: 'song',
            description: 'Search for your song',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],

    permissionsRequired: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],
    botPermissions: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],

    deleted: false,
}