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

    const invoice = await Invoice.findById(invoiceId)

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const itemsHTML = invoice.items
      .map(
        (item) => `
      ${item.productName}: $${item.price.toFixed(2)} x ${item.quantity}</p>
    `
      )
      .join("");

    const invoiceHTML = `
      <html>
        <head>
          <title>Invoice</title>
          <style>
          body {
            font-family: Arial, sans-serif;
          }

          h1{
            text-align:center;
          }
          th, tr, td{
            border:1px solid grey;
          }
          table {
            width:  80%;
            margin: auto;
            text-align:center;
            border: 2px solid grey;
          }

          .total-container{
            diplay:flex;
            jusitfy-content:center
          }

          .oty{
            color:blue;

          }
          .footer {
            background-color: black;
            color: white;
            padding:  20px;
            margin-top:  80%;
            width:  80%;
            height:50px;
            border-radius:
            margin: auto;
          }
          .footer h2 {
            margin-bottom:  10px;
          }

          .total{
            position:relative;
            top"10px;
            right:0;
            color:blue
          }
        </style>
        </head>
        <body>
          <h1>Invoice</h1>
          <table>
    <thead>
      <tr>
        <th>Product Name</th>
        <th>Price</th>
        <th>Quantity</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.items
        .map(
          (item) => `
        <tr>
          <td>${item.productName}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td calss="qty">${item.quantity}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>

  <div class="total-container">
  <p class="total">Invoice Number: ${invoice.invoiceNumber}</p>
  <p class="total">Total Amount: INR ${invoice.totalAmount.toFixed(2)}</p>
  </div>
 
          <div class="footer">
            <h2>Terms and Conditions</h2>
            <p>Your terms and conditions go here.</p>
          </div>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(invoiceHTML);
    const pdf = await page.pdf({ format: "A4" });
    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.send(pdf);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while generating the invoice PDF" });
  }
};
