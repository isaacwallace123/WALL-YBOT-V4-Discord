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

        try {
            await interaction.deferReply();

            const firstImage = targetUser.user.displayAvatarURL({ dynamic: false, format: "png", size: 256 });

            let data = await Canvacord.slap(interaction.user.displayAvatarURL({ dynamic: false, format: "png", size: 256 }), firstImage);

            const attachment = new AttachmentBuilder(data);
            interaction.editReply({ files: [attachment], content: `${interaction.user} POW! ${targetUser}` });
        } catch(err) {
            console.log(err);
        }
    },

    name: 'slap',
    description: "Slap someone of choice.",

    devOnly: false,
    testOnly: false,

    options: [
        {
            name: 'user',
            description: "The user you wanna slap..",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
    ],

    cooldown: 10,

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}