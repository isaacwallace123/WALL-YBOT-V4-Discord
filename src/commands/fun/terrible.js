const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { Welcomer, Canvacord } = require('canvacord');

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

            const firstImage = targetUser.user.displayAvatarURL({ dynamic: false, format: "png", size: 256 });

            let data = await Canvacord.hitler(firstImage);

            const attachment = new AttachmentBuilder(data);
            interaction.editReply({ files: [attachment], content: `${targetUser}` });
        } catch(err) {
            console.log(err);
        }
    },

    name: 'terrible',
    description: "This person is terrible!",

    devOnly: false,
    testOnly: false,

    options: [
        {
            name: 'user',
            description: "The user you think is terrible.",
            type: ApplicationCommandOptionType.User
        },
    ],

    cooldown: 10,

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}