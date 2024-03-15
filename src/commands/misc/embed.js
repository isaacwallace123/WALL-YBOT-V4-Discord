const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const canvacord = require('canvacord');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async(client, interaction) => {
        try {
            await interaction.deferReply();
            
            const welcomeAttachment = new canvacord.Welcomer()
                .setAvatar(interaction.member.user.displayAvatarURL({ dynamic: false, format: "png", size: 256 }))
                .setUsername(interaction.user.username)
                .setDiscriminator(interaction.member.user.discriminator)
                .setGuildName(interaction.guild.name)
                .setMemberCount(interaction.guild.memberCount + 1)

                .setColor("border", "#FFFFFF")
                .setColor("title-border", "#D8F4FF")
                .setColor("title", "#589FFF")
                .setColor("username-box", "#589FFF")
                .setColor("discriminator-box", "#589FFF")
                .setColor("message-box", "#589FFF")
                .setColor("background", "#F7FBFF")
                .setColor("hashtag", "#589FFF")

                .setText("title", "WELCOME")
                .setText("message", `WELCOME TO ${interaction.guild.name.toUpperCase()}`)
                .setText("member-count", `~ ${interaction.guild.memberCount}th member !`)


            const attachment = await welcomeAttachment.build();
            interaction.editReply({ files: [attachment] });
        } catch(err) {
            console.log(err);
        }
    },

    name: 'embed',
    description: "Creates a custom embed",

    devOnly: true,
    testOnly: true,

    options: [],

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}