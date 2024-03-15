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

        const targetUserId = interaction.options.get('user')?.value || interaction.user;
        const targetUser = await interaction.guild.members.fetch(targetUserId);

        try {
            await interaction.deferReply();

            const firstImage = targetUser.user.displayAvatarURL({ dynamic: false, format: "png", size: 256 });

            let data = await Canvacord.shit(firstImage);

            const attachment = new AttachmentBuilder(data);
            interaction.editReply({ files: [attachment], content: `${targetUser}` });
        } catch(err) {
            console.log(err);
        }
    },

    name: 'shit',
    description: "EWWW! I stepped in shit!",

    devOnly: false,
    testOnly: false,

    options: [
        {
            name: 'user',
            description: "The user you want to use for this command.",
            type: ApplicationCommandOptionType.User,
        },
    ],

    cooldown: 10,

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}