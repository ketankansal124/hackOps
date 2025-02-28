const mongoose = require('mongoose');
const User = require('./userSchema');

const InvestorSchema = new mongoose.Schema({
    info: { type: String }
});

const Investor = User.discriminator('Investor', InvestorSchema);

module.exports = Investor;
