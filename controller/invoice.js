const Invoice = require("../model/invoice");
const generateRandomId = require("../utils/randomIdGenerator");
const puppeteer = require("puppeteer");

exports.createInvoice = async (req, res, next) => {
  try {
    const { items, totalAmount, userId } = req.body;
    console.log(items, totalAmount, userId);

    if (!items || !totalAmount || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "All the fields are required" });
    }

    const invoiceNumber = generateRandomId();
    console.log(invoiceNumber);

    const invoice = await Invoice.create({
      invoiceNumber,
      items,
      totalAmount,
      userId,
    });

    console.log(`Invoice : `, invoice);

    if (!invoice) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to create invoice" });
    }

    res.status(200).json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generatePdf = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    console.log(invoiceId);

    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    const invoiceHTML = `
      <html>
        <head>
          <title>Invoice</title>
        </head>
        <body>
          <h1>Invoice</h1>
          <p>Invoice Number: ${invoice.invoiceNumber}</p>
          <p>Total Amount: $${invoice.totalAmount}</p>
          <!-- Add more invoice details here -->
        </body>
      </html>
    `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(invoiceHTML);
    const pdf = await page.pdf({ format: "A4" });
    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.send(pdf);
  } catch (error) {
    console.error(error);

    const invoice = await Invoice.findById(invoiceId);
    console.log(`Invoice found:`, invoice);
    res
      .status(500)
      .json({ message: "An error occurred while generating the invoice PDF" });
  }
};
