const Server = require('../../models/Server');

module.exports = async(Amount, GuildId) => {
    try {
        let server = await Server.findOne({ guildId: GuildId });

        if(!server) {
            server = new Server({
                guildId: GuildId,
                tax,
                lotteryTax,
            });
            await server.save();
        }

        return { ServerTax: Math.round(Amount * (server.tax / 100)), LotteryTax: Math.round(Amount * (server.lotteryTax / 100)), Amount: Math.round((Amount - ((Amount * (server.tax / 100)) + (Amount * (server.lotteryTax / 100))))) };
    } catch(err) {
        console.log(err);
    }
}