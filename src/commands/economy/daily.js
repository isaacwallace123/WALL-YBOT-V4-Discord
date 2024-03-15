const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

const userHandler = require('../../utils/DataBase/userHandler');

const Suffix = require('../../utils/math/suffixNumber');

const dailyAmount = 1000;

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

        try {
            let { User, Data } = await userHandler.getUser(interaction);

            const lastDaily = Data.daily.toDateString();
            const currentDate = new Date().toDateString();

            if (lastDaily === currentDate) {
                interaction.reply({ content: "You have already collected your dailies today. Come back tomorrow!", ephemeral: true });
                return;
            }

            await interaction.deferReply();

            await userHandler.set(interaction, ["daily"], new Date());
            Data = await userHandler.pay(interaction, dailyAmount);

            interaction.editReply(`**${process.env.CURRENCY || "$"}${Suffix(dailyAmount)}** was added to your balance. Your new balance is **${process.env.CURRENCY || "$"}${Suffix(Data.balance)}**`);
        } catch(err) {
            console.log(err);
        }
    },

    name: 'daily',
    description: "Collect your daily sum of money.",

    devOnly: false,
    testOnly: false,

    options: [],

    cooldown: 10,

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}