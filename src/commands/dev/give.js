const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

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
            interaction.reply({
                content: "You can only run this command inside a server.",
                ephemeral: true,
            });
            return;
        }

        const targetUserId = interaction.options.get('user').value;

        let amount = interaction.options.get('amount').value;
        if (amount < 1) amount = 1;

        const targetUserObj = await interaction.guild.members.fetch(targetUserId);

        if (targetUserObj.user.bot) {
            interaction.reply({
                content: "You cannot give money to bots!",
                ephemeral: true,
            });
            return;
        }

        try {
            await userHandler.pay(targetUserObj, amount);
            await interaction.deferReply({ ephemeral: true });
    
            interaction.editReply({ content: `Transaction has been completed. Successfully gave ${targetUserObj} **${process.env.CURRENCY || "$"}${Suffix(amount)}**` });
        } catch(err) {
            console.log(err);
        }
    },

    name: 'give',
    description: "Print money and give it to a user",

    devOnly: true,
    testOnly: false,

    options: [
        {
            name: 'user',
            description: 'The user you want to pay.',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'amount',
            description: 'The amount you want to pay.',
            type: ApplicationCommandOptionType.Integer,
            required: true
        }
    ],

    cooldown: 0,

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}