const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

const suffix = require('../math/suffixNumber');

let structure = new Object();

structure.new = async(interaction, commandObject, channelObject) => {
    if((commandObject.devOnly != undefined && commandObject.devOnly) || (commandObject.testOnly != undefined && commandObject.testOnly)) return;

    let fields = [];

    try {
        let logged = new EmbedBuilder()
            .setTitle('A command has been invoked!')
            .setColor('Blue')
            .setDescription(`<@${interaction.user.id}> attempted to use \`/${commandObject.name}\` on this exact date:\n\n \`${new Date()}\`\n\nHere are the options used (If there are any):\n╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼`)
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: false, format: "png", size: 256 }))
            .setTimestamp()
            .setFooter({ text: 'Wall-Y Bot Logging', iconURL: interaction.user.displayAvatarURL({ dynamic: false, format: "png", size: 256 }) })

        if(commandObject.options != null && commandObject.options != undefined && commandObject.options != []) {
            for(let option of commandObject.options) {
                let value = interaction.options.get(option.name)?.value
    
                if(value != undefined) {
                    if(option.type === ApplicationCommandOptionType.Integer) {
                        value = suffix(value);
                    }

                    if(option.type === ApplicationCommandOptionType.User) {
                        value = `<@${value}>`;
                    }

                    if(option.type === ApplicationCommandOptionType.Channel) {
                        value = `<#${value}>`;
                    }
    
                    fields.push({ name: `${option.name}`, value: `${value}`, inline: true });
                }
            }
        }

        logged.setFields(fields);

        return channelObject.send({ embeds: [logged] });
    } catch(err) {
        console.log(err);
    }
}

module.exports = structure;