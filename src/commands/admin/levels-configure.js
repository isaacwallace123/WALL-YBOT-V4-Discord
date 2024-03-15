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

        const toggle = interaction.options.get('toggle')?.value;
        const multiplier = interaction.options.get('multiplier')?.value;

        try {
            await interaction.deferReply({ ephemeral: true });

            if(toggle === undefined && multiplier === undefined) {
                interaction.editReply(`You have to use an option to change.`);
                return;
            }

            let server = await serverHandler.getServer(interaction);

            if(toggle != undefined) {
                if(server.levelsEnabled === toggle) {
                    interaction.editReply(`This feature was already ${toggle ? "Enabled" : "Disabled"}.`);
                    return;
                }

                await serverHandler.set(interaction, ["levelsEnabled"], toggle);
            }

            if(multiplier != undefined) {
                if(server.levelsMultiplier === multiplier) {
                    interaction.editReply(`Levels multiplier was already set to ${multiplier}`);
                    return;
                }

                if (multiplier < 1 || multiplier > 5) {
                    interaction.editReply(`You cannot set the multiplier to a number below 1 or greater than 5.`);
                    return;
                }

                await serverHandler.set(interaction, ["levelsMultiplier"], multiplier);
            }

            interaction.editReply("Levels has been configured.");
        } catch(err) {
            console.log(err);
        }
    },

    name: 'levels-configure',
    description: "Disable levels for your server.",

    devOnly: false,
    testOnly: false,

    options: [
        {
            name: 'toggle',
            description: "Would you like to enable or disable levels.",
            type: ApplicationCommandOptionType.Boolean,
        },
        {
            name: 'multiplier',
            description: "This is a multiplier for speed at which you level up.",
            type: ApplicationCommandOptionType.Number,
        },
    ],

    cooldown: 10,

    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [],

    deleted: false,
}