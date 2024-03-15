const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, AttachmentBuilder } = require('discord.js');
const ms = require('ms');
const { Canvacord } = require('canvacord');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async(client, interaction) => {
        const user = interaction.options.get('user').value;
        const duration = interaction.options.get('duration').value;
        const reason = interaction.options.get('reason')?.value || "No reason provided";
        
        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(user);
        if(!targetUser) {
            await interaction.editReply({content: "That user doesn't exist in this server.", ephemeral: true });
            return;
        }

        if(targetUser.user.bot) {
            await interaction.editReply({ content: "I can't timeout a bot.", ephemeral: true });
            return;
        }

        const msDuration = ms(duration);
        if(isNaN(msDuration)) {
            await interaction.editReply({ content: "Please provide a valid timeout duration.", ephemeral: true });
            return;
        }

        if(msDuration < 5000 || msDuration > 2.419e9) {
            await interaction.editReply({ content: "Timeout duration cannot be less than 5 seconds or more than 28 days.", ephemeral: true });
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;

        if(targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply({ content: "You can't timeout that user. They have the same/greater role than you.", ephemeral: true });
            return;
        }

        if(targetUserRolePosition >= botRolePosition) {
            await interaction.editReply({ content: "I can't timeout that user. They have the same/greater role than me", ephemeral: true });
            return;
        }

        try {
            const { default: prettyMs } = await import('pretty-ms');

            if(targetUser.isCommunicationDisabled()) {
                await targetUser.timeout(msDuration, reason);
                await interaction.editReply({ content: `${targetUser}'s timeout has been updated to ${prettyMs(msDuration, { verbose: true })}.\nReason: ${reason}`, ephemeral: false });
                return;
            }

            await targetUser.timeout(msDuration, reason);

            const userImage = targetUser.user.displayAvatarURL({ dynamic: false, format: "png", size: 256 });
            const data = await Canvacord.jail(userImage);
            const attachment = new AttachmentBuilder(data);

            await interaction.editReply({ files: [attachment], content: `${targetUser} was timed out for ${prettyMs(msDuration, { verbose: true })}.\nReason: ${reason}` });
        } catch(err) {
            if(err.status === 403) {
                await interaction.editReply({ content: `I do not have the power to timeout that user!`, ephemeral: true });
                return;
            } else {
                console.log(err);
            }
        }
    },

    name: 'timeout',
    description: 'Timeout a user',

    devOnly: false,
    testOnly: false,

    options: [
        {
            name: 'user',
            description: 'User you want to timeout',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'duration',
            description: 'The duration of the timeout',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'reason',
            description: 'The reason for the timeout',
            type: ApplicationCommandOptionType.String,
        },
    ],

    permissionsRequired: [PermissionFlagsBits.MuteMembers],
    botPermissions: [PermissionFlagsBits.MuteMembers],
    
    deleted: false,
}