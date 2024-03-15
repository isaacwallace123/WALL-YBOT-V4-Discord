const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

const serverHandler = require('../../utils/DataBase/serverHandler');
const userHandler = require('../../utils/DataBase/userHandler');

const Suffix = require('../../utils/math/suffixNumber');

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

        let amount = interaction.options.get('amount').value;
        if (amount < 1) amount = 1;

        try {
            let server = await serverHandler.getServer(interaction);

            if(server.bank < amount) {
                amount = server.bank;
            }
    
            if(amount < 1) {
                interaction.reply({
                    content: "The bank needs money to be able to give money to people.",
                    ephemeral: true,
                });
                return;
            }

            await serverHandler.decrease(interaction, ["bank"], amount);
            await userHandler.pay(interaction, amount);

            interaction.reply({ content: `You have successfully withdrew **${process.env.CURRENCY || "$"}${Suffix(amount)}**`});
        } catch(err) {
            console.log(err);
        }
    },

    name: 'bank-withdraw',
    description: "Withdraw money for the server bank.",

    devOnly: false,
    testOnly: false,

    options: [
        {
            name: 'amount',
            description: "The amount of money you'd like to withdraw.",
            required: true,
            type: ApplicationCommandOptionType.Integer
        },
    ],

    cooldown: 10,

    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [],

    deleted: false,
}