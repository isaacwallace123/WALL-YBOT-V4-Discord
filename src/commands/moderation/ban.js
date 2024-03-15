const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async(client, interaction) => {
        const targetUserId = interaction.options.get('user').value;
        const reason = interaction.options.get('reason')?.value || "No reason provided";

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if(!targetUser) {
            await interaction.editReply("That user doesn't exit in this server.");
            return;
        }

        if(targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply("Cannot ban the server owner!");
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;

        if(targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("You can't ban that user. They have the same/greater role than you.");
            return;
        }

        if(targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("I can't ban that user. They have the same/greater role than me");
            return;
        }

        try {
            await targetUser.ban({ reason });
            await interaction.editReply(`User ${targetUser} was banned.\nReason: ${reason}`);
        } catch(err) {
            console.log(err);
        }
    },

    name: 'ban',
    description: 'Bans the specified user from server.',

    devOnly: false,
    testOnly: false,

    options: [
        {
            name: 'user',
            description: 'User you want banned',
            required: true,
            type: ApplicationCommandOptionType.User,
        },
        {
            name: 'reason',
            description: 'The reason for banning.',
            type: ApplicationCommandOptionType.String,
        }
    ],

    permissionsRequired: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],

    deleted: false,
}