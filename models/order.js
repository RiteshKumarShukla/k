const mongoose = require('mongoose');

// order schema
const orderSchema = new mongoose.Schema({
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
  deliveryPlatform: { type: String, default: '' },
  trackingId: { type: String, default: '' },
  trackingUrl: { type: String, default: '' },
  paymentMethod: { type: String, required: true },
  timeOfPayment: { type: Date, default: Date.now },
  userCurrency: { type: String, required: true },
  userID: { type: String, required: true },
  isPaid: { type: Boolean, default: false },
  status: { type: String, default: 'new', enum: ['new', 'inprogress', 'completed'] },
  deliveredAt: { type: Date }
});

module.exports = mongoose.model('Order', orderSchema);
