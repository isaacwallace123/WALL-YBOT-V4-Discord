const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async(client, interaction) => {
        const amount = interaction.options.get('amount').value;
        const target = interaction.options.get('user')?.value;

        await interaction.deferReply({ ephemeral: true });

        try {
            const messages = await interaction.channel.messages.fetch({
                limit: amount + 1,
            });
    
            const res = new EmbedBuilder()
                .setColor("Blue")
            
            if(target) {
                const targetObj = await interaction.guild.members.fetch(target);

                let i = 0;
                const filtered = [];
    
                (await messages).filter((msg) => {
                    if(msg.author.id === targetObj.id && amount > i) {
                        filtered.push(msg);
                        i++
                    }
                });
    
                await interaction.channel.bulkDelete(filtered).then(messages => {
                    res.setDescription(`Successfully deleted ${messages.size} messages from ${targetObj}.`);
                    interaction.editReply({ embeds: [res] });
                });
            } else {
                await interaction.channel.bulkDelete(amount, true).then(messages => {
                    res.setDescription(`Successfully deleted ${messages.size} messages.`);
                    interaction.editReply({ embeds: [res] });
                });
            }
        } catch(err) {
            if(err.code === 50035) {
                interaction.editReply("Could not delete messages. Too much!");
            } else {
                console.log(err);
            }
            
        }
    },

    name: 'purge',
    description: 'Clear text from either specific user or just text.',

    devOnly: false,
    testOnly: false,

    options: [
        {
            name: 'amount',
            description: 'The amount of messages read from purge.',
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
        {
            name: 'user',
            description: 'Filter from what user',
            type: ApplicationCommandOptionType.User,
        },
        
    ],

    permissionsRequired: [PermissionFlagsBits.ManageMessages],
    botPermissions: [PermissionFlagsBits.ManageMessages],

    deleted: false,
}