const getApplicationCommands = require('./getApplicationCommands');
const getLocalCommands = require('./getLocalCommands');
const areCommandsDifferent = require('./areCommandsDifferent');

module.exports = async(client, server) => {
    try {
        const localCommands = getLocalCommands()
        const applicationCommands = await getApplicationCommands(client, server);

        for(const localCommand of localCommands) {
            const { name, description, options } = localCommand;
            
            const existingCommand = await applicationCommands.cache.find((cmd) => cmd.name === name);

            if(existingCommand) {
                if(localCommand.deleted) {
                    await applicationCommands.delete(existingCommand.id);
                    continue;
                }

                if(areCommandsDifferent(existingCommand, localCommand)) {
                    await applicationCommands.edit(existingCommand.id, {
                        description,
                        options,
                    });
                }
            } else {
                if(localCommand.deleted) {
                    continue;
                }

                await applicationCommands.create({
                    name,
                    description,
                    options,
                });
            }
        }
    } catch(err) {
        throw err;
    }
}