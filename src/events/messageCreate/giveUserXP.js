const { Client, Message } = require('discord.js');

const userHandler = require('../../utils/DataBase/userHandler');
const serverHandler = require('../../utils/DataBase/serverHandler');

const calculateLevelXP = require('../../utils/math/calculateLevelXP');
const cooldowns = new Set();

function getRandomXP(min, max, Multiplier) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor((Math.floor(Math.random() * (max - min + 1)) + min) * Multiplier);
}

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */

module.exports = async(client, message) => {
    if(!message.inGuild() || message.author.bot || cooldowns.has(message.author.id)) return;

    const userObj = await message.guild.members.fetch(message.author.id);

    const server = await serverHandler.getServer(userObj);

    if(!server || !server.levelsEnabled) return;

    const xpToGive = getRandomXP(5, 15, server.levelsMultiplier || 1);
    
    try {
        let { Data } = await userHandler.getUser(userObj);
        
        await userHandler.increase(userObj, ["xp"], xpToGive);
        
        if(Data.xp > calculateLevelXP(Data.level)) {
            await userHandler.set(userObj, ["xp"], 0);
            await userHandler.increase(userObj, ["level"], 1);

            message.channel.send(`${message.member} you have leveled up to **Level ${Data.level}.**`);
        }

        cooldowns.add(message.author.id);
        setTimeout(() => {
            cooldowns.delete(message.author.id)
        }, 5000);
    } catch(err) {
        console.log(err);
    }
}