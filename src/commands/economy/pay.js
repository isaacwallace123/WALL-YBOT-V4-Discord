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

        if(Number(targetUserId) === Number(interaction.member.id)) {
            interaction.reply({
                content: "You cannot pay yourself money!",
                ephemeral: true,
            });
            return;
        }

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
            let { Data } = await userHandler.getUser(interaction);
    
            if(Data.balance < amount) {
                amount = Data.balance;
            }
    
            if(amount < 1) {
                interaction.reply({
                    content: "You need money to pay people.",
                    ephemeral: true,
                });
                return;
            }

            await userHandler.charge(interaction, amount);
            await userHandler.pay(targetUserObj, amount);
    
            await interaction.deferReply();
    
            interaction.editReply(`Transaction has been completed. Successfully gave ${targetUserObj} **${process.env.CURRENCY || "$"}${Suffix(amount)}**`);
        } catch(err) {
            console.log(err);
        }
    },

    name: 'pay',
    description: "Give money to a user",

    devOnly: false,
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

    cooldown: 10,

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}