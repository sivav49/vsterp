let express = require('express');
let clientRoute = require('./client/client.route');
let invoiceRoute = require('./invoice/invoice.route');
// import authRoutes from './auth.route';

const router = express.Router();

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/clients', clientRoute);
router.use('/invoices', invoiceRoute);

// // mount auth routes at /auth
// router.use('/auth', authRoutes);

module.exports = router;
