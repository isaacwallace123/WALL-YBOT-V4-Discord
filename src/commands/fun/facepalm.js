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

        const targetUserId = interaction.user.id;
        const targetUser = await interaction.guild.members.fetch(targetUserId);

        try {
            await interaction.deferReply();

            let image = await Canvas.facepalm(targetUser.user.displayAvatarURL({ size: 256 }));

            const attachment = new AttachmentBuilder(image);
            interaction.editReply({ files: [attachment], content: `${targetUser}` });
        } catch(err) {
            console.log(err);
        }
    },

    name: 'facepalm',
    description: "Send when you are dissapointed",

    devOnly: false,
    testOnly: false,

    options: [],

    cooldown: 10,

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}