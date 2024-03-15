const main = require('../../utils/commands/addInteractions');

module.exports = async (client) => {
    try {
        for(let [ID,Info] of client.guilds.cache) {
            main(client, ID);
        }
    } catch(err) {
        console.log(err);
    }
}