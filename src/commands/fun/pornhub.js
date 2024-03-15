const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { Canvacord } = require('canvacord');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async(client, interaction) => {
        if(!interaction.inGuild()) {
            interaction.reply({ content: "You can only run this command inside a server.", ephemeral: true });
            return;
        }

        const targetUserId = interaction.options.get('user').value;
        const targetUser = await interaction.guild.members.fetch(targetUserId);

        const comment = interaction.options.get('comment').value;

        try {
            await interaction.deferReply();

            const firstImage = targetUser.user.displayAvatarURL({ dynamic: false, format: "png", size: 256 });

            let data = await Canvacord.phub(options = { username: targetUser.user.username, message: comment, image: firstImage });

            const attachment = new AttachmentBuilder(data);
            interaction.editReply({ files: [attachment], content: `${targetUser}` });
        } catch(err) {
            console.log(err);
        }
    },

    name: 'pornhub',
    description: "This will make a user of choice say anything on a pornhub overlay.",

    devOnly: false,
    testOnly: false,

    options: [
        {
            name: 'user',
            description: "The user you want to use for phub.",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'comment',
            description: "This is the comment you want them to say.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    cooldown: 10,

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}