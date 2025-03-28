const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    requrired: [true, 'booking must belong to a tour'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    requrired: [true, 'Booking must belong to user'],
  },
  price: {
    type: Number,
    require: [true, 'booking must have a price'],
  },
  createdAt: {
    type: Date,
    deafult: Date.now(),
  },
  paid: {
    type: Boolean,
    deafult: true,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });
  next();
});

const Booking = mongoose.model('booking', bookingSchema);
module.exports = Booking;
