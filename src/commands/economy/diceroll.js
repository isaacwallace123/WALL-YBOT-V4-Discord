const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

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
        
        const chosenSide = Math.floor(Math.random() * 6) + 1;

        try {
            let { Data } = await userHandler.getUser(interaction);

            if(amount > Data.balance) {
                amount = Data.balance;
            };

            if(amount <= 0) return interaction.reply({ content: `You do not have enough money to gamble!`, ephemeral: true });

            await interaction.deferReply();

            interaction.editReply("Rolling Dice...");

            if(chosenSide === side) {
                amount *= 6;

                const taxed = await AfterTax(amount, interaction.guild.id);
                amount = taxed.Amount

                await userHandler.pay(interaction, amount);

                await serverHandler.set(interaction, ["tax"], taxed.ServerTax);
                await serverHandler.set(interaction, ["lottery"], taxed.LotteryTax);
            } else {
                const taxed = await AfterTax(amount, interaction.guild.id);

                await userHandler.charge(interaction, amount);

                await serverHandler.set(interaction, ["tax"], taxed.ServerTax);
                await serverHandler.set(interaction, ["lottery"], taxed.LotteryTax);
            }

            interaction.editReply(`Coin landed on **${chosenSide}**! You **${chosenSide === side ? "won" : "lost"} ${process.env.CURRENCY || "$"}${Suffix(amount)}**`);
        } catch(err) {
            console.log(err);
        }
    },

    name: 'roll-dice',
    description: "Roll a dice and bet on the number. Multiply your money by 6X",

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
            description: 'Numbers 1 through 6',
            type: ApplicationCommandOptionType.Integer,
            choices: [
                {
                    name: "1",
                    value: 1,
                },
                {
                    name: "2",
                    value: 2,
                },
                {
                    name: "3",
                    value: 3,
                },
                {
                    name: "4",
                    value: 4,
                },
                {
                    name: "5",
                    value: 5,
                },
                {
                    name: "6",
                    value: 6,
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