const User = require('./User');

const InvestorSchema = new mongoose.Schema({
    info: { type: String }
});

const Investor = User.discriminator('investor', InvestorSchema);
module.exports = Investor;
