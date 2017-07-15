let express = require('express');
let clientRoute = require('./client/client.route');
let InvoiceVatModel = require('./invoice/invoice-vat.model');
let InvoiceGstModel = require('./invoice/invoice-gst.model');
let InvoiceBosModel = require('./invoice/invoice-bos.model');
let invoiceRoute = require('./invoice/invoice.route');
// import authRoutes from './auth.route';

const router = express.Router();

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/clients', clientRoute);
router.use('/invoices', invoiceRoute(InvoiceVatModel));
router.use('/invoice-gst', invoiceRoute(InvoiceGstModel));
router.use('/invoice-bos', invoiceRoute(InvoiceBosModel));

// // mount auth routes at /auth
// router.use('/auth', authRoutes);

module.exports = router;
