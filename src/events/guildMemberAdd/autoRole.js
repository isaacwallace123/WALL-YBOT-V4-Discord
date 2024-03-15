const { Client, GuildMember } = require('discord.js');
const Server = require('../../models/Server');

/**
 * 
 * @param {Client} client 
 * @param {GuildMember} member 
 */

module.exports = async(client, member) => {
    try {
        let guild = member.guild;
        if(!guild) return;

        const server = await Server.findOne({ guildId: guild.id });
        
        if(!server) return;
        if(server.autoRoleId === null) return;

        await member.roles.add(server.autoRoleId);
    } catch(err) {
        console.log(err);
    }
}