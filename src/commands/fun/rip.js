const { Client, Interaction, ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');
const { Canvas } = require('canvacord');

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

            let image = await Canvas.rip(targetUser.user.displayAvatarURL({ size: 256 }));

            const attachment = new AttachmentBuilder(image);
            interaction.editReply({ files: [attachment], content: `${targetUser}` });
        } catch(err) {
            console.log(err);
        }
    },

    name: 'rip',
    description: "F in chat please..",

    devOnly: false,
    testOnly: false,
    
    options: [
        {
            name: 'user',
            description: "The person you want to pay respects to.",
            type: ApplicationCommandOptionType.User
        },
    ],

    cooldown: 10,

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}