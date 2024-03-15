const { Client, Interaction, ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');
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

        const firstUserId = interaction.options.get('first-user').value;
        const secondUserId = interaction.options.get('second-user').value;

        if(firstUserId === secondUserId) {
            interaction.reply({ content: "You cannot place the same users in bed.", ephemeral: true });
            return;
        }

        const firstUserObj = await interaction.guild.members.fetch(firstUserId);
        const secondUserObj = await interaction.guild.members.fetch(secondUserId);

        try {
            await interaction.deferReply();

            const firstImage = firstUserObj.user.displayAvatarURL({ dynamic: false, format: "png", size: 256 });
            const secondImage = secondUserObj.user.displayAvatarURL({ dynamic: false, format: "png", size: 256 });

            let data = await Canvacord.bed(firstImage,secondImage);

            const attachment = new AttachmentBuilder(data);
            interaction.editReply({ files: [attachment], content: `${firstUserObj} <= <3 => ${secondUserObj}` });
        } catch(err) {
            console.log(err);
        }
    },

    name: 'bed',
    description: "Place 2 people in a bed <3.",

    devOnly: false,
    testOnly: false,

    options: [
        {
            name: 'first-user',
            description: "First user you want in the bed.",
            required: true,
            type: ApplicationCommandOptionType.User
        },
        {
            name: 'second-user',
            description: "Second user you want in the bed.",
            required: true,
            type: ApplicationCommandOptionType.User
        },
    ],

    cooldown: 10,

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}