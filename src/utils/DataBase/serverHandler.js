const Server = require('../../models/Server');

const serverData = {
    autoRoleId: null,
    levelsEnabled: true,
    levelsMultiplier: 1,
    bank: 0,
    lottery: 0,
    tax: 0,
    lotteryTax: 0
}

let structure = new Object();

structure.getServer = async(targetGuildObj) => {
    let server = await Server.findOne({ guildId: targetGuildObj.guild.id });

    if(!server) {
        console.log("Created New Server");

        server = new Server({
            guildId: targetGuildObj.guild.id,
            ...serverData,
        });

        await server.save();
    }

    return server;
}

structure.set = async(interaction, object, value) => {
    let server = await structure.getServer(interaction);

    server[object] = value;

    await server.save();

    return server;
}

structure.increase = async(interaction, object, amount) => {
    let server = await structure.getServer(interaction);

    server[object] += amount;

    await server.save();

    return server;
}

structure.decrease = async(interaction, object, amount) => {
    let server = await structure.getServer(interaction);

    server[object] -= amount;

    await server.save();

    return server;
}

module.exports = structure;