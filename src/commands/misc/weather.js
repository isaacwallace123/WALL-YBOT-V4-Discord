const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const weatherJs = require('weather-js');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */


    callback: async (client, interaction) => {
        const Location = interaction.options.get('location').value;
        const Temperature = interaction.options.get('type').value;

        await interaction.deferReply({ ephemeral: true });

        interaction.editReply("Searching For Location...");

        try {
            weatherJs.find({ search: Location, degreeType: Temperature }, function (error, result) {
                if (error) return interaction.editReply("There was a problem running the command!");
                if (result === undefined || result.length === 0) return interaction.editReply("That is an invalid location!");

                let current = result[0].current;
                let location = result[0].location;

                if (!current || !location) return interaction.editReply("Location doesn't exist or does not have recorded weather!");

                const weatherinfo = new EmbedBuilder()
                    .setDescription(`**${current.skytext}**`)
                    .setAuthor({ name: `Weather forecast for ${current.observationpoint}` })
                    .setThumbnail(current.imageUrl)
                    .addFields(
                        { name: 'Timezone', value: `UTC${location.timezone}`, inline: true },
                        { name: 'Degree Type', value: `${Temperature === "C" && "Celsius" || "Fahrenheit"}`, inline: true },
                        { name: 'Temperature', value: `${current.temperature}°`, inline: true },
                        { name: 'Wind', value: current.winddisplay, inline: true },
                        { name: 'Feels like', value: `${current.feelslike}°`, inline: true },
                        { name: 'Humidity', value: `${current.humidity}%`, inline: true },
                    )
                    .setColor(0x111111)

                return interaction.editReply({ content: "", embeds: [weatherinfo] });
            });
        } catch (err) {
            console.log(err);
        }
    },

    name: 'weather',
    description: "Check out the weather in any location!",

    devOnly: false,
    testOnly: false,

    options: [
        {
            name: 'location',
            description: 'The location you want to see the weather for.',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'type',
            description: 'In what degree would you like to see it in.',
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: "Celsius",
                    value: "C",
                },
                {
                    name: "Fahrenheit",
                    value: "F"
                }
            ],
            required: true,
        },
    ],

    cooldown: 20,

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}