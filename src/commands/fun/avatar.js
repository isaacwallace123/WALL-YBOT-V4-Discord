const { Client, Interaction, ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');

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

        const targetUserId = interaction.options.get('user')?.value || interaction.user.id;
        const targetUser = await interaction.guild.members.fetch(targetUserId);

        try {
            await interaction.deferReply();

            const attachment = new AttachmentBuilder(targetUser.user.displayAvatarURL({ size: 256 }));
            interaction.editReply({ files: [attachment], content: `${targetUser}` });
        } catch(err) {
            console.log(err);
        }
    },

    name: 'avatar',
    description: "Get the users avatar.",

    devOnly: false,
    testOnly: false,

    options: [
        {
            name: 'user',
            description: "The user you want to get the avatar from.",
            type: ApplicationCommandOptionType.User
        }
    ],

    cooldown: 10,

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}