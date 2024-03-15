const { Client, Interaction } = require('discord.js');
const Suffix = require('../../utils/math/suffixNumber');

const userHandler = require('../../utils/DataBase/userHandler');

const begMax = 500;

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
            await interaction.deferReply();

            const begAmount = Math.floor(Math.random() * begMax);
            const NewData = await userHandler.pay(interaction, begAmount);

            interaction.editReply(`**${process.env.CURRENCY || "$"}${Suffix(begAmount)}** was added to your balance. You new balance is **${process.env.CURRENCY || "$"}${Suffix(NewData.balance)}**`);
        } catch(err) {
            console.log(err);
        }
    },

    name: 'beg',
    description: "Beg for money you peasent.",

    devOnly: false,
    testOnly: false,

    options: [],

    cooldown: 60,

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}