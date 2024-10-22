import express from "express";
import CryptoJS from "crypto-js";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
config();

const prismaClient = new PrismaClient();
const orderRouter = express.Router();

// Function to generate port pos authorization token
const generateAuthorization = (appKey, secretKey) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const md5Hash = CryptoJS.MD5(secretKey + timestamp).toString();
  const base64Token = btoa(appKey + ":" + md5Hash);
  return `Bearer ${base64Token}`;
};

// Generate token for port pos
const portPosAuthToken = generateAuthorization(
  process.env.PORT_POS_APP_KEY,
  process.env.PORT_POS_SECRET
);


// Create Order and Invoice route
orderRouter.post("/create", async (req, res) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    customerStreet,
    customerCity,
    customerState,
    customerZipCode,
    customerCountry,
    amount,
    productName,
    productDetails,
  } = req.body;

  const payload = {
    order: {
      amount: parseFloat(amount),
      currency: process.env.PORT_POS_CURRENCY,
      redirect_url: process.env.PORT_POS_REDIRECT_URL,
      ipn_url: process.env.IPN_URL,
    },
    product: {
      name: productName,
      description: productDetails,
    },
    billing: {
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        address: {
          street: customerStreet,
          city: customerCity,
          state: customerState,
          zipcode: customerZipCode,
          country: customerCountry,
        },
      },
    },
  };

  fetch("https://api-sandbox.portwallet.com/payment/v2/invoice", {
    method: "POST",
    headers: {
      Authorization: portPosAuthToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then(async ({ data }) => {
      // DB Insert
      await prismaClient.order.create({
        data: {
          customerName,
          customerEmail,
          customerPhone,
          customerAddress:
            customerStreet + "," + customerCity + "," + customerState,
          amount: parseFloat(amount),
          productName,
          productDetails,
          invoiceId: data.invoice_id,
        },
      });

      return res.status(200).json({ data });
    })
    .catch((error) => {
      console.error("Error:", error);
      return res.status(500).json({ error: error });
    });
});


// Get invoice with invoice id
orderRouter.post("/invoice", async (req, res) => {
  const { invoiceId } = req.body;
  // console.log(invoiceId);
  fetch(`https://api-sandbox.portwallet.com/payment/v2/invoice/${invoiceId}`, {
    headers: {
      Authorization: portPosAuthToken,
    },
  })
    .then((response) => response.json())
    .then(async (data) => {
      // console.log("Response Data:", data);
      return res.status(200).json({ data: data });
    })
    .catch((error) => {
      console.error("Error:", error);
      return res.status(500).json({ error: error });
    });
});


// Get all orders
orderRouter.get("/", async (req, res) => {
  await prismaClient.order
    .findMany()
    .then((data) => {
      // console.log(data)
      res.status(200).json({ data });
    })
    .catch((err) => {
      res.status(500).json({ message: "Something wrong", error: err });
    });
});


// IPN handler for payment status update
orderRouter.post("/ipn-handler", async (req, res) => {
  const { status, invoice_id } = req.body;
  if (status === "PAID") {
    await prismaClient.order
      .update({
        where: {
          invoiceId: invoice_id,
        },
        data: {
          paymentStatus: "PAID",
        },
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        res.status(200).send("IPN received");
      });
  } else {
    console.log("Payment failed");
  }
});

export default orderRouter;
