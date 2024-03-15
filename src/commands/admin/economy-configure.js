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

        const serverTax = interaction.options.get('server-tax')?.value || null;
        const lotteryTax = interaction.options.get('lottery-tax')?.value || null;

        try {
            await interaction.deferReply({ ephemeral: true });

            if(serverTax === null && lotteryTax === null) {
                interaction.editReply("Cannot configure without settings.");
                return;
            }

            let server = await serverHandler.getServer(interaction);

            if(serverTax) {
                if(server.tax === serverTax) {
                    interaction.editReply("Your server-tax was already configured at that number.");
                    return;
                }
    
                if(serverTax < 0 || serverTax > 100) {
                    interaction.editReply("Your inputted number for server-tax is either above 100 or less than 0. This is impossible.");
                    return;
                }

                server.tax = serverTax;
            }

            if(lotteryTax) {
                if(server.lotteryTax === lotteryTax) {
                    interaction.editReply("Your lottery-tax was already configured at that number.");
                    return;
                }
    
                if(lotteryTax < 0 || lotteryTax > 100) {
                    interaction.editReply("Your inputted number for lottery-tax is either above 100 or less than 0. This is impossible.");
                    return;
                }

                server.lotteryTax = lotteryTax;
            }

            if((server.lotteryTax + server.tax) > 100) {
                interaction.editReply("Both of your tax options exceed 100%. This is impossible");
                return;
            }

            await server.save();

            interaction.editReply("Your economy has been configured.");
        } catch(err) {
            console.log(err);
        }
    },

    name: 'economy-configure',
    description: "Configure the economy for your server",

    devOnly: false,
    testOnly: false,

    options: [
        {
            name: "server-tax",
            description: "This is the tax rate of the server. (Any item bought, server bank will receive this amount)",
            type: ApplicationCommandOptionType.Integer,
        },
        {
            name: "lottery-tax",
            description: "This is the amount of money taken from purchases and placed into the loterry",
            type: ApplicationCommandOptionType.Integer,
        },
    ],

    cooldown: 10,

    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [],

    deleted: false,
}