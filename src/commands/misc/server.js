const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const Server = require('../../models/Server');

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
            let server = await Server.findOne({ guildId: interaction.guild.id });

            if(!server) {
                server = new Server({
                    guildId: interaction.guild.id,
                });
                await server.save();
            }
            
            if(options === "tax") {
                interaction.reply({
                    content: `The server tax is **%${Suffix(server.tax)}**`,
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

    name: 'server',
    description: "You can check some info about the server",

    devOnly: false,
    testOnly: false,

    options: [
        {
            name: 'options',
            description: 'What would you like to do.',
            type: ApplicationCommandOptionType.String,
            choices: [
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