const express = require("express");
const router = express.Router();
const { createInvoice, generatePdf } = require("../controller/invoice");

router.route("/createinvoice").post(createInvoice);
router.route("/download/:invoiceId").get(generatePdf);

module.exports = router;
