const { Client, Interaction, ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');
const fruitList = ['cherry', 'apple', 'chestnut', 'lemon', 'pear', 'banana', 'grape', 'watermelon', 'watermelon-slice', 'blueberry', 'cantelope', 'orange', 'durian'];

const fs = require('fs');
const path = require('path');

const videosFolder = path.join(__dirname, '../../', 'video/fruits');

const getFruitAttachment = (fruit) => {
    let selectedFruit;

    const files = fs.readdirSync(videosFolder, { withFileTypes: true });

    for(const file of files) {
        if (file.isDirectory()) continue;
        if (file.isFile()) {
            let fruitFile = file.name.split('.')[0];

            if(fruitFile != fruit) continue; 

            selectedFruit = path.join(videosFolder, file.name);
            break;
        }
    }

    return selectedFruit;
}

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

        await interaction.deferReply();

        const chosenFruit = interaction.options.get('type')?.value || fruitList[Math.floor(Math.random() * fruitList.length)];

        try {
            const fruitVideo = getFruitAttachment(chosenFruit);

            const attachment = new AttachmentBuilder(fruitVideo);
            interaction.editReply({ files: [attachment], content: `What's ***${chosenFruit}*** doing today?` });
        } catch(err) {
            console.log(err);
        }
    },

    name: 'fruit',
    description: "Let's see what the fruits are up to.",

    devOnly: false,
    testOnly: false,

    options: [
        {
            name: 'type',
            description: "The type of fruit",
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: "cherry",
                    value: "cherry",
                },
                {
                    name: "apple",
                    value: "apple",
                },
                {
                    name: "chestnut",
                    value: "chestnut",
                },
                {
                    name: "lemon",
                    value: "lemon",
                },
                {
                    name: "pear",
                    value: "pear",
                },
                {
                    name: "banana",
                    value: "banana",
                },
                {
                    name: "grape",
                    value: "grape",
                },
                {
                    name: "watermelon",
                    value: "watermelon",
                },
                {
                    name: "watermelon slice",
                    value: "watermelon-slice",
                },
                {
                    name: "blueberry",
                    value: "blueberry",
                },
                {
                    name: "cantelope",
                    value: "cantelope",
                },
                {
                    name: "orange",
                    value: "orange",
                },
                {
                    name: "durian",
                    value: "durian",
                },
            ],
        }
    ],

    cooldown: 10,

    permissionsRequired: [],
    botPermissions: [],

    deleted: false,
}