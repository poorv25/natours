const path = require('path');
const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
// eslint-disable-next-line import/no-extraneous-dependencies
const cookieParser = require('cookie-parser');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandlers = require('./controllers/errorController');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));
//1 Global MiddleWare

// serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));
// Set security HTTP headers
// app.use(helmet());
// app.use((req, res, next) => {
//   res.setHeader(
//     'Content-Security-Policy',
//     "script-src-elem 'self' https://cdnjs.cloudflare.com https://js.stripe.com/acacia/stripe.js;",
//     "default-src 'self' https://*.mapbox.com; connect-src 'self' ws://127.0.0.1:*;",
//   );
//   next();
// });

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", 'https://*.mapbox.com'],
        scriptSrc: [
          "'self'",
          'https://cdnjs.cloudflare.com',
          'https://api.mapbox.com',
          'https://js.stripe.com',
          "'unsafe-inline'", // Use cautiously
        ],
        connectSrc: [
          "'self'",
          'https://*.mapbox.com',
          'ws://127.0.0.1:*', // For development websockets
          'https://js.stripe.com',
          'wss://*.stripe.com',
        ],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        frameSrc: ['https://js.stripe.com'],
      },
    },
  }),
);

// app.use((req, res, next) => {
//   res.setHeader(
//     'Content-Security-Policy',
//     "script-src 'self' https://cdnjs.cloudflare.com https://js.stripe.com;",
//   );
//   res.setHeader(
//     'Content-Security-Policy',
//     "frame-src 'self' https://js.stripe.com;", // Allows Stripe Checkout iframe
//   );
//   next();
// });
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: [
//         "'self'",
//         'https://cdnjs.cloudflare.com',
//         'https://api.mapbox.com',
//         'https://js.stripe.com',
//         'blob:',
//       ],
//       frameSrc: ["'self'", 'https://js.stripe.com'], // Required for Stripe Checkout
//       connectSrc: ["'self'", 'https://api.stripe.com'], // Required for Stripe API calls
//     },
//   }),
// );
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP.please try again in an hour',
});
app.use('/api', limiter);
// BOdy parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data Sanitization against XSS
app.use(xss());
// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// Route Handlers

// ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/booking', bookingRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandlers);
module.exports = app;
