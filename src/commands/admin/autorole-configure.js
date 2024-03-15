const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const serverHandler = require('../../utils/DataBase/serverHandler');

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

        const targetRoleId = interaction.options.get('role')?.value;
        const disabled = interaction.options.get('disabled')?.value;

        try {
            await interaction.deferReply({ ephemeral: true });

            if(disabled === undefined && targetRoleId === undefined) {
                interaction.editReply("Cannot configure without settings.");
                return;
            }

            let server = await serverHandler.getServer(interaction);

            if(targetRoleId != undefined) {
                if(server.autoRoleId === targetRoleId) {
                    interaction.editReply("Auto role has already been configured for that role.");
                    return;
                }

                await serverHandler.set(interaction, ["autoRoleId"], targetRoleId);
            }

            if(disabled != undefined) {
                if(server.autoRoleId === null) {
                    interaction.editReply(`This feature was already ${disabled ? "Enabled" : "Disabled"}.`);
                    return;
                }

                await serverHandler.set(interaction, ["autoRoleId"], null);
            }

            interaction.editReply("Auto role has now been configured.");
        } catch(err) {
            console.log(err);
        }
    },

    name: 'autorole-configure',
    description: "Configure your auto-role for this server.",

    devOnly: false,
    testOnly: false,

    options: [
        {
            name: 'role',
            description: "The role you wants users to gain upon joining.",
            type: ApplicationCommandOptionType.Role,
        },
        {
            name: 'disabled',
            description: "Whether or not you'd like to enabled or disable this feature.",
            type: ApplicationCommandOptionType.Boolean,
        }
    ],

    cooldown: 10,

    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.ManageRoles],

    deleted: false,
}