const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async(client, interaction) => {
        if(!interaction.inGuild()) {
            interaction.reply({ content: "You can only run this command inside a server.", ephemeral: true });
            return;
        }

        const option = interaction.options.get('option').value;

        try {
            await interaction.deferReply({ ephemeral: true });

            if(option === "configuring") {
                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Hello!')
                    .setURL('https://discord.gg/WTEf7Ecr7Q')
                    .setAuthor({ name: 'Wall-Y Bot', iconURL: client.user.displayAvatarURL({ size: 256 }), url: 'https://discord.js.org' })
                    .setDescription(`**Thank you for choosing ${client.user.username} as one of your discord bots!**`)
                    .addFields(
                        { name: '/levels-configure', value: 'You would use this command to simple change minor aspects of the leveling system this bot provides. By default, the leveling system is enabled however, you could disable it using this command. You could also add a xp multiplier of a value between 1 (default) and 5.', inline: false },
                        { name: '/economy-configure', value: 'You would use this command to change the economy to your preferences. For example, you could change the server tax. You could change the alocated tax for lottery. You can also change the daily amount of money you earn (Ranging from 1 to 10K a day) as well as change the beg amount (Ranging from 1 to 500).', inline: false },
                        { name: '/autorole-configure', value: 'You would use this command to add an autorole feature to your server. By default, this option is disabled however, by using this command, you could add a role that a user would gain upon joining your server.', inline: false },
                        { name: '/logs-configure', value: 'You would use this command to add a logs channel to your server. This would allow you to track all commands that are ran by all users excluding admin commands.', inline: false },
                    )
                    .setImage(client.user.displayAvatarURL({ size: 256 }))
                    .setTimestamp()
                    .setFooter({ text: 'Wall-Y Bot', iconURL: client.user.displayAvatarURL({ size: 256 }) });
                
                interaction.editReply({ embeds: [embed], ephemeral: true });
                return;
            }
        } catch(err) {
            console.log(err);
        }
    },

    name: 'help',
    description: "Disable levels for your server.",

    devOnly: false,
    testOnly: false,

    options: [
        {
            name: 'option',
            description: 'What do you need help with?',
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: "configuring",
                    description: 'This will help you configure your server.',
                    value: "configuring",
                },
            ],
            required: true
        },
    ],

    cooldown: 10,

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}