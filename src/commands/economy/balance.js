const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const Suffix = require('../../utils/math/suffixNumber');

const userHandler = require('../../utils/DataBase/userHandler')

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

        const targetUserId = interaction.options.get('user')?.value || interaction.member.id;
        const targetUserObj = await interaction.guild.members.fetch(targetUserId);

        if (targetUserObj.user.bot) {
            interaction.reply({
                content: "You cannot check the balance of a bot!",
                ephemeral: true,
            });
            return;
        }
        
        await interaction.deferReply({ ephemeral: true });

        const { Data } = await userHandler.getUser(targetUserObj);

        interaction.editReply(targetUserId === interaction.member.id ? `Your balance is **${process.env.CURRENCY || "$"}${Suffix(Data.balance)}**` : `<@${targetUserId}>'s balance is **${process.env.CURRENCY || "$"}${Data.balance}**`);
    },

    name: 'balance',
    description: "See yours/someone's balance.",

    devOnly: false,
    testOnly: false,

    options: [
        {
            name: 'user',
            description: 'The user whose balance you would like to see.',
            type: ApplicationCommandOptionType.User,
        }
    ],

    cooldown: 10,

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}