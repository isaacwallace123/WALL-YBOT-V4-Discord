const { Client, Interaction, EmbedBuilder } = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async(client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const owner = (await interaction.guild.fetchOwner()).user.tag;

        const Embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('Wall-Y Bot Information')
            .setURL(`https://discord.gg/hfgnKtRznk`)
            .setThumbnail(client.user.displayAvatarURL({ size: 256 }))
            .addFields(
                { name: 'Bot Creator', value: 'Isaac Wallace', inline: false },
                { name: 'Server Owner', value: owner, inline: false },
                { name: 'Bot Service', value: 'Auto-Moderation, Music, and Fun!', inline: false },
            )
            .setFooter({ text: 'Wall-Y Bot', iconURL: client.user.displayAvatarURL({ size: 256 }) })
            .setTimestamp();

        interaction.editReply({ content: "", embeds: [Embed] });
    },

    name: 'info',
    description: "Want to know more about the bot?",

    devOnly: false,
    testOnly: false,

    cooldown: 10,

    options: [],

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}