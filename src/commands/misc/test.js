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
            await interaction.deferReply({ ephemeral: true });

            const firstImage = targetUser.user.displayAvatarURL({ dynamic: false, format: "png", size: 256 });

            let data = await Canvacord.hitler(firstImage);
            //data = new AttachmentBuilder(UserImage);

            /*const welcomeImage = new Welcomer()
                .setAvatar(UserImage)
                .setUsername(targetUserObj.user.username)
                .setDiscriminator(targetUserObj.user.discriminator)
                .setGuildName(targetUserObj.guild.name)
                .setMemberCount(targetUserObj.guild.memberCount)
                
                .setColor("border", "#43424E")
                .setColor("background", "#4F4E59")

                .setColor("username-box", "#000000")
                .setColor("discriminator-box", "#000000")
                .setColor("message-box", "#4F4E59")

                .setOpacity("username-box", 0.5)
                .setOpacity("discriminator-box", 0.5)

                .setColor("hashtag", "#000000")

                .setColor("title", "#FFFFFF")
                .setColor("title-border", "#242526")

                .setColor("message", "#FFFFFF")
                

                .setColor("avatar", "#3E3C58")

                .setText("member-count", "{count}th Member")
                .setText("title", "welcome")

            const data = await welcomeImage.build();*/
            const attachment = new AttachmentBuilder(data);
            interaction.editReply({ files: [attachment], content: `${targetUser}` });
        } catch(err) {
            console.log(err);
        }
    },

    name: 'test',
    description: "This is a testing command",

    devOnly: true,
    testOnly: true,

    options: [
        {
            name: 'user',
            description: "First user you want to fuse.",
            required: true,
            type: ApplicationCommandOptionType.User
        },
    ],

    cooldown: 10,

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}