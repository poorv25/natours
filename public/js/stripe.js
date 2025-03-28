import axios from 'axios';
import { showAlert } from './alerts';

// import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';
const stripe = Stripe(
  'pk_test_51R6FVoLqRoMu4LlCqca2uCyipliBARDwvHBCoRiQddzVms5mLLwOOt2is0iGsCuP1P3k7j4TCblbLm8QpToI2RUX00kuwPnx7l',
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session form API
    const session = await axios(
      `http://127.0.0.1:8000/api/v1/booking/checkout-session/${tourId}`,
      // `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    //  2) create checkout form + charge credit card

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
