const mongoose = require('mongoose');

const orderDraftSchema = new mongoose.Schema({
  customerInfo: {
    shipping: {
      customerName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      country: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true }
    },
    billing: {
      customerName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      country: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true }
    }
  },
  cartProducts: [Object],
  shippingMethod: { type: String, required: true },
  shippingCharges: { type: Number, required: true },
  discount: { type: Number, required: true },
  finalAmount: { type: Number, required: true },
  deliveryPlatform: { type: String },
  trackingId: { type: String },
  trackingUrl: { type: String },
  isPaid: { type: Boolean, default: false, required: true },
  paymentMethod: { type: String, required: true },
  timeOfPayment: { type: String, required: true },
  userCurrency: { type: String, required: true },
  userID: { type: String, required: true },
  status: { type: String, default: 'new', enum: ['new', 'inprogress', 'completed'] }
});

module.exports = mongoose.model('OrderDraft', orderDraftSchema);
