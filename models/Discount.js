const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    discount: { type: Number, required: true }, // The discount percentage or amount
    priceINR: { type: Number, required: false }, // Minimum price threshold in INR
    priceUSD: { type: Number, required: false }, // Minimum price threshold in USD
    priceEUR: { type: Number, required: false }, // Minimum price threshold in EUR
    priceGBP: { type: Number, required: false }, // Minimum price threshold in GBP
    priceCAD: { type: Number, required: false }, // Minimum price threshold in CAD
    priceAUD: { type: Number, required: false }, // Minimum price threshold in AUD
    priceJPY: { type: Number, required: false }, // Minimum price threshold in JPY
    startDate: { type: Date, required: true }, // Start date of the discount period
    endDate: { type: Date, required: true },   // End date of the discount period
});

module.exports = mongoose.model('Discount', discountSchema);

