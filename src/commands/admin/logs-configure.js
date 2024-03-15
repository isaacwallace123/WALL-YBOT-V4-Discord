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

        const channel = interaction.options.get('channel')?.value;
        const toggle = interaction.options.get('toggle')?.value;

        try {
            await interaction.deferReply({ ephemeral: true });

            if(channel === undefined && toggle === undefined) {
                interaction.editReply(`You have to use an option to change.`);
                return;
            }

            if(channel != undefined) {
                await serverHandler.set(interaction, ["logsChannel"], channel);
            }

            if(toggle != undefined) {
                await serverHandler.set(interaction, ["logsEnabled"], toggle);
            }

            interaction.editReply("Your logs channel has been configured.");
        } catch(err) {
            console.log(err);
        }
    },

    name: 'logs-configure',
    description: "Configure the logs channel for your server.",

    devOnly: false,
    testOnly: false,

    options: [
        {
            name: "channel",
            description: "Choose which channel you want to have logs in.",
            type: ApplicationCommandOptionType.Channel,
        },
        {
            name: "toggle",
            description: "Choose to enable or disable this feature.",
            type: ApplicationCommandOptionType.Boolean,
        }
    ],

    cooldown: 10,

    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [],

    deleted: false,
}