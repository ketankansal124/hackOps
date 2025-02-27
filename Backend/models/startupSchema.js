const User = require('./User');

const StartupOwnerSchema = new mongoose.Schema({
    startup_name: { type: String, required: true },
    industry: { type: String, required: true },
    number_of_founders: { type: Number, required: true },
    male_presenters: { type: Number, default: 0 },
    female_presenters: { type: Number, default: 0 },
    transgender: { type: Number, default: 0 },
    couple_presenters: { type: Number, default: 0 },
    pitchers_average_age: { type: String, enum: ["Middle", "Young", "Old"] },
    pitchers_state: { type: String },
    yearly_revenue: { type: Number },
    monthly_sales: { type: Number },
    gross_margin: { type: Number },
    net_margin: { type: Number },
    ebitda: { type: Number },
    cash_burn: { type: Boolean },
    skus: { type: Number },

    has_patents: { type: Boolean, default: false },
    bootstrapped: { type: Boolean, default: false },

    original_ask_amount: { type: Number, required: true },
    original_offered_equity: { type: Number, required: true },
    valuation_requested: { type: Number },
    advisory_equity: { type: Number },

    received_offer: { type: Boolean, default: false }
});

const StartupOwner = User.discriminator('startup_owner', StartupOwnerSchema);
module.exports = StartupOwner;
