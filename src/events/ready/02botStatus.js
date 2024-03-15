const { ActivityType } = require("discord.js");

module.exports = (client) => {
    const status = [
        {
            name: 'streets by goosewal',
            type: ActivityType.Streaming,
            url: "https://www.youtube.com/watch?v=6jVhL0BJ3j4",
        },
        {
            name: 'commands',
            type: ActivityType.Listening,
        },
        {
            name: `over servers`,
            type: ActivityType.Watching,
        }
    ]

    setInterval(() => {
        let random = Math.floor(Math.random() * status.length);
        client.user.setActivity(status[random]);
    }, 10000);
};