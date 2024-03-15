const User = require('../../models/User');

const guildData = {
    balance: 0,
    level: 1,
    xp: 0,
    daily: new Date(),
}

let structure = new Object();

structure.getUser = async(targetUserObj) => {
    if (targetUserObj.user.bot) { return { user: null, ID: false, Data: null } }
    let user = await User.findOne({ userId: targetUserObj.user.id, guildId: targetUserObj.guild.id }); //, guildId: targetUserObj.guild.id

    /*if(!user) {
        console.log("Created New User");

        user = new User({
            userId: targetUserObj.user.id,

            guilds: new Map()
        });

        user.guilds.set(targetUserObj.guild.id, guildData);

        await user.save();
    }

    if(!user.guilds.get(targetUserObj.guild.id)) {
        console.log("Created New Guild");

        user.guilds.set(targetUserObj.guild.id, guildData);

        await user.save();
    }
    
    return { user: user, ID: targetUserObj.guild.id, Data: user.guilds.get(targetUserObj.guild.id) };*/

    if(!user) {
        console.log("Created New User");

        user = new User({
            userId: targetUserObj.user.id, 
            guildId: targetUserObj.guild.id,
            ...guildData,
        });

        await user.save();
    }

    return { user: user, ID: false, Data: user };
}

structure.set = async(targetUserObj, Object, Value) => {
    let { user, ID, Data } = await structure.getUser(targetUserObj);

    if(!ID) {
        Data[Object] = Value;

        await user.save();
    } else {
        await User.findOneAndUpdate(
            { userId: targetUserObj.user.id },
            { $set: { [`${ID}.${Object}`]: Value } },
            { new: true }
        ).then(updatedUser => {
            console.log("New User Data:\n");
            console.log(updatedUser);
        }).catch(err => {
            console.log(err);
        });
    }

    return Data;
},

structure.increase = async(targetUserObj, Object, amount) => {
    let { user, ID, Data } = await structure.getUser(targetUserObj);

    if(!ID) {
        Data[Object] += amount;

        await user.save();
    } else {
        await User.findOneAndUpdate(
            { userId: targetUserObj.user.id },
            { $inc: { [`${ID}.${Object}`]: amount } },
            { new: true }
        ).then(updatedUser => {
            console.log("New User Data:\n");
            console.log(updatedUser);
        }).catch(err => {
            console.log(err);
        });
    }

    return Data;
},

structure.decrease = async(targetUserObj, Object, amount) => {
    let { user, ID, Data } = await structure.getUser(targetUserObj);

    if(!ID) {
        Data[Object] -= amount;

        await user.save();
    } else {
        await User.findOneAndUpdate(
            { userId: targetUserObj.user.id },
            { $inc: { [`${ID}.${Object}`]: (amount * -1) } },
            { new: true }
        ).then(updatedUser => {
            console.log("New User Data:\n");
            console.log(updatedUser);
        }).catch(err => {
            console.log(err);
        });
    }

    return Data;
},

structure.charge = async(targetUserObj, amount) => {
    return await structure.decrease(targetUserObj, ["balance"], amount);
}

structure.pay = async(targetUserObj, amount) => {
    return await structure.increase(targetUserObj, ["balance"], amount);
},

module.exports = structure;