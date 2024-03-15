const { Collection } = require('discord.js');
const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/commands/getLocalCommands');

const serverHandler = require('../../utils/DataBase/serverHandler');
const logCommands = require('../../utils/log/logCommands');

const cooldowns = new Map();

module.exports = async (client, interaction) => {
    if(!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();

    try {
        const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);

        if(!commandObject) return;

        if(commandObject.devOnly) {
            if(!devs.includes(interaction.member.id)) {
                interaction.reply({
                    content: "This is a developer only command!",
                    ephemeral: true,
                });
                return;
            }
        }

        if(commandObject.testOnly) {
            if(!(interaction.guild.id === testServer)) {
                interaction.reply({
                    content: "This command cannot be ran in this server!",
                    ephemeral: true,
                });
                return;
            }
        }

        if(commandObject.permissionsRequired?.length) {
            for(const permission of commandObject.permissionsRequired) {
                if(!interaction.member.permissions.has(permission)) {
                    interaction.reply({
                        content: "Not enough permissions.",
                        ephemeral: true,
                    });
                    return;
                }
            }
        }

        if(commandObject.botPermissions?.length) {
            for(const permission of commandObject.botPermissions) {
                const bot = interaction.guild.members.me;

                if(!bot.permissions.has(permission)) {
                    interaction.reply({
                        content: "I don't have enough permissions.",
                        ephemeral: true,
                    });
                    return;
                }
            }
        }

        if(commandObject.cooldown) {
            if (!cooldowns.has(commandObject.name)) {
                cooldowns.set(commandObject.name, new Collection());
            }
        
            const currentTime = Date.now();
            const timeStamps = cooldowns.get(commandObject.name);
            const cooldownAmount = (commandObject.cooldown) * 1000;
        
            if (timeStamps.has(interaction.member.id)) {
                const expiration_time = timeStamps.get(interaction.member.id) + cooldownAmount;
        
                if (currentTime < expiration_time) {
                    const time_left = (expiration_time - currentTime) / 1000;
                    
                    return interaction.reply({ content: `Please wait ${time_left.toFixed(1)} more seconds before using \`/${commandObject.name}\`!`, ephemeral: true });
                }
            }
        
            timeStamps.set(interaction.member.id, currentTime);
            setTimeout(() => timeStamps.delete(interaction.member.id), cooldownAmount);
        }

        const server = await serverHandler.getServer(interaction);

        if(server.logsEnabled != undefined && server.logsEnabled) {
            if(server.logsChannel != undefined) {
                const channel = client.channels.cache.get(server.logsChannel);

                if(channel != undefined) {
                    await logCommands.new(interaction, commandObject, channel);
                }
            }
        }

        await commandObject.callback(client, interaction);
    } catch(err) {
        console.log(err);
    }
};