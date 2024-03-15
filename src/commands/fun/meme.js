const { Client, Interaction, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const fetchData = require('../../utils/fetch/fetchData');

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

        try {
            await interaction.deferReply();

            const meme = await fetchData(`https://www.reddit.com/r/memes/random/.json`);

            const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle(meme[0].data.children[0].data.title || "Possibly Broken URL")
                .setImage(meme[0].data.children[0].data.url || "")
                .setURL(meme[0].data.children[0].data.url || "https://wall-y.ca/")
                .setFooter({ text: meme[0].data.children[0].data.author || "Possibly Broken URL" })

            interaction.editReply({ embeds: [embed] });
        } catch(err) {
            console.log(err);
        }
    },

    name: 'meme',
    description: "Fetch a random meme from reddit. (Not the best memes honestly)",

    devOnly: false,
    testOnly: false,

    options: [],

    cooldown: 10,

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}