const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, AttachmentBuilder } = require('discord.js');
const User = require('../../models/User');
const UserHandler = require('../../utils/DataBase/userHandler')
const canvacord = require('canvacord');
const calculateLevelXP = require('../../utils/math/calculateLevelXP');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async(client, interaction) => {
        if(!interaction.inGuild()) {
            interaction.reply("You can only run this command inside a server.");
            return;
        }

        const mentionedUserId = interaction.options.get('user')?.value
        const targetUserId = mentionedUserId || interaction.member.id;
        const targetUserObj = await interaction.guild.members.fetch(targetUserId);

        if(targetUserObj.user.bot) {
            interaction.reply({
                ephemeral: true, content: "That is a discord bot you fool."
            });
            return;
        }

        await interaction.deferReply();

        const { Data } = await UserHandler.getUser(targetUserObj);

        let allLevels = await User.find({ guildId: interaction.guild.id }).select('-_id userId level xp');

        allLevels.sort((a,b) => {
            if(a.level === b.level) {
                return b.xp - a.xp;
            } else {
                return b.level - a.level;
            }
        });

        let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;

        const rank = new canvacord.Rank()
            .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256 }))
            .setRank(currentRank)
            .setLevel(Data.level)
            .setCurrentXP(Data.xp)
            .setRequiredXP(calculateLevelXP(Data.level))
            .setStatus(targetUserObj.presence?.status || "offline")
            .setProgressBar('#FFC300', 'COLOR')
            .setUsername(targetUserObj.user.username)
            .setDiscriminator(targetUserObj.user.discriminator)

        const data = await rank.build();
        const attachment = new AttachmentBuilder(data);
        interaction.editReply({ files: [attachment] });
    },

    name: 'level',
    description: "Shows your/someone's level",

    devOnly: false,
    testOnly: false,

    options: [
        {
            name: "user",
            description: "The user whos level you want to see",
            type: ApplicationCommandOptionType.User,
        }
    ],

    cooldown: 20,

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}