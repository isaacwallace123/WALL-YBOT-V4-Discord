const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');

const userHandler = require('../../utils/DataBase/userHandler');
const serverHandler = require('../../utils/DataBase/serverHandler');

const Suffix = require('../../utils/math/suffixNumber');
const AfterTax = require('../../utils/math/afterTaxes');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async(client, interaction) => {
        if(!interaction.inGuild()) {
            interaction.reply({
                content: "You can only run this command inside a server.",
                ephemeral: true,
            });
            return;
        }

        let amount = interaction.options.get('amount').value;

        if(amount < 1) amount = 1;

        const side = interaction.options.get('side').value;
        const chosenSide = Math.round(Math.random()) > 0 ? "heads" : "tails"

        try {
            let { User, Data } = await userHandler.getUser(interaction);

            if(amount > Data.balance) {
                amount = Data.balance;
            };

            if(amount <= 0) {
                interaction.reply({ content: "You do not have enough money to run this command.", ephemeral: true });
                return;
            }

            await interaction.deferReply();

            interaction.editReply("Flipping coin..");

            const taxed = await AfterTax(amount, interaction.guild.id);
            
            if(chosenSide === side) {
                amount = taxed.Amount;
                await userHandler.pay(interaction, amount);
            } else {
                await userHandler.charge(interaction, amount);
            }

            await serverHandler.increase(interaction, ["bank"], taxed.ServerTax);
            await serverHandler.increase(interaction, ["lottery"], taxed.LotteryTax);

            interaction.editReply(`Coin landed on **${chosenSide}**! You **${chosenSide === side ? "won" : "lost"} ${process.env.CURRENCY || "$"}${Suffix(amount)}**`);
        } catch(err) {
            console.log(err);
        }
    },

    name: 'coin-flip',
    description: "Flip a coin and possible double your money",

    devOnly: false,
    testOnly: false,

    options: [
        {
            name: 'amount',
            description: 'The amount you want to gamble.',
            type: ApplicationCommandOptionType.Integer,
            required: true
        },
        {
            name: 'side',
            description: 'Heads or Tails',
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: "heads",
                    value: "heads",
                },
                {
                    name: "tails",
                    value: "tails",
                },
            ],
            required: true
        },
    ],

    cooldown: 5,

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}