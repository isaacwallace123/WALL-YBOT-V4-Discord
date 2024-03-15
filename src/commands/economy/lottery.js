const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

const userHandler = require('../../utils/DataBase/userHandler');
const serverHandler = require('../../utils/DataBase/serverHandler');

const AfterTax = require('../../utils/math/afterTaxes');
const Suffix = require('../../utils/math/suffixNumber');

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

        const options = interaction.options.get('options').value;

        try {
            const server = await serverHandler.getServer(interaction);

            if(options === "purchase") {
                const { User, Data } = await userHandler.getUser(interaction);

                if(Data.balance < Number(process.env.LOTTERY_PRICE)) {
                    interaction.reply({
                        content: `You do not have enough money to purchase a ticket.`,
                        ephemeral: true,
                    });
                    return;
                } else {
                    const taxes = await AfterTax(Number(process.env.LOTTERY_PRICE), interaction.guild.id);

                    await userHandler.charge(interaction, taxes.Amount);

                    await serverHandler.increase(interaction, ["bank"], taxes.ServerTax);
                    await serverHandler.increase(interaction, ["lottery"], taxes.LotteryTax);
                }

                const Answer = (Math.floor(Math.random() * 1000) + 1);

                if(Answer == process.env.LOTTERY_NUMBER) {
                    interaction.reply({
                        content: `YOU WON THE LOTTERY!! YOU GAINED **${process.env.CURRENCY || "$"}${server.lottery}**`,
                        ephemeral: false,
                    });

                    await userHandler.pay(interaction, server.lottery);
                    await serverHandler.set(interaction, ["lottery"], 0);
                } else {
                    interaction.reply({
                        content: `You got the numbers **${Answer}**! Lotto number is ${process.env.LOTTERY_NUMBER}`,
                        ephemeral: false,
                    });
                }

                return;
            } else if(options === "worth") {
                interaction.reply({
                    content: `The total amount of money you can win from lottery is **${process.env.CURRENCY || "$"}${Suffix(server.lottery)}**`,
                    ephemeral: true,
                });
                return;
            } else if(options === "price") {
                interaction.reply({
                    content: `The price to buy 1 lottery ticket is **${process.env.CURRENCY || "$"}${Suffix(process.env.LOTTERY_PRICE)}**`,
                    ephemeral: true,
                });
                return;
            } else if(options === "number") {
                interaction.reply({
                    content: `The winning numbers for the lottery are **${process.env.LOTTERY_NUMBER}**`,
                    ephemeral: true,
                });
                return;
            } else if(options === "tax") {
                interaction.reply({
                    content: `The lottery tax is **%${Suffix(server.lotteryTax)}**`,
                    ephemeral: true,
                });
                return;
            } else {
                interaction.reply({
                    content: "An unexpected error occured..",
                    ephemeral: true,
                });
                return;
            }
        } catch(err) {
            console.log(err);
        }
    },

    name: 'lottery',
    description: "You can check some info or buy lottery tickets.",

    devOnly: false,
    testOnly: false,

    options: [
        {
            name: 'options',
            description: 'What would you like to do.',
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: "purchase",
                    value: "purchase",
                },
                {
                    name: "worth",
                    value: "worth",
                },
                {
                    name: "price",
                    value: "price",
                },
                {
                    name: "number",
                    value: "number",
                },
                {
                    name: "tax",
                    value: "tax",
                }
            ],
            required: true
        },
    ],

    cooldown: 10,

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}