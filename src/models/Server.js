const { Schema, model } = require("mongoose");

const serverSchema = new Schema({
   guildId: {
    type: String,
    required: true,
    unique: true,
   },
   autoRoleId: {
    type: String,
   },
   levelsEnabled: {
      type: Boolean,
      default: true,
   },
   levelsMultiplier: {
      type: Number,
      default: 1,
   },
   bank: {
      type: Number,
      default: 0,
   },
   lottery: {
      type: Number,
      default: 0,
   },
   tax: {
      type: Number,
      default: 0,
   },
   lotteryTax: {
      type: Number,
      default: 0,
   },
   logsChannel: {
      type: String,
   },
   logsEnabled: {
      type: Boolean,
   }
});

module.exports = model('Server', serverSchema);