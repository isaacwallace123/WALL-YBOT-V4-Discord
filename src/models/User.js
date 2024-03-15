const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    xp: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 0,
    },
    balance: {
        type: Number,
        default: 0,
    },
    daily: {
        type: Date,
    },

    /*guilds: {
        type: Schema.Types.Map,
        required: true,
    },*/
});

module.exports = model('User', userSchema);