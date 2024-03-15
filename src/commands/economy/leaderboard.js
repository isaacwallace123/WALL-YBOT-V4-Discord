const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const Suffix = require('../../utils/math/suffixNumber');

const User = require('../../models/User');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */


    callback: async(client, interaction) => {
        let data = await User.find({});

        const type = interaction.options.get('type').value;

        const desc = type == "Global" && await Global(client, interaction, data) || await Server(client, interaction, data);

        const embed = new EmbedBuilder()
            .setTitle(`${type} Leaderboard`)
            .setColor("Blue")
            .setDescription('Here is the leaderboard!\n\n' + desc);
        
        await interaction.deferReply({ ephemeral: true });

        interaction.editReply({ content: "", embeds: [embed] });
    },

    name: 'leaderboard',
    description: "Check out who's in the top ten richest users.",

    devOnly: false,
    testOnly: false,

    options: [
        {
            name: 'type',
            description: 'Global Or Server',
            type: ApplicationCommandOptionType.String,
            choices: [
                /*{
                    name: "Global",
                    value: "Global",
                },*/
                {
                    name: "Server",
                    value: "Server",
                }
            ],
            required: true
        }
    ],

    cooldown: 5,

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}

const Global = async(client, interaction, data) => {
    let members = [];

    for (let obj of data) {
        members.push(obj);
    }

    members = await filter(members);

    return display(client, interaction, members);
}

const Server = async(client, interaction, data) => {
    let members = [];

    for (let obj of data) {
        if(obj.guildId == interaction.guild.id) {
            members.push(obj);
        }
    }

    members = await filter(members);

    return display(client, interaction, members);
}

const filter = async(members) => {
    members = members.sort(function(b, a) {
        return a.balance - b.balance;
    });

    members = members.filter(function BigEnough(value) {
        return value.balance > 0;
    });

    /*members = members.filter(function onlyUnique(value, index, array) {
        console.log(array.indexOf(value), index);
        return array.indexOf(value) === index;
    });*/

    members = [...new Map(members.map((m) => [m.userId, m])).values()];

    members = members.slice(0, 10);

    return members;
}

const display = async(client, interaction, members) => {
    let desc = "";

    for(let index = 0; index < members.length; index++) {
        let member = client.users.cache.get(members[index].userId);

        if (!member) return "No Members Found At This Moment!";

        const addition = member.id === interaction.user.id && "**" || "";
        desc += `${addition}${index + 1}. ${member.username} - ${Suffix(members[index].balance)}${addition}\n\n`;
    }

    return desc;
}