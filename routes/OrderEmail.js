const express = require("express");
const router = express.Router();
const axios = require("axios");
const { SendMailClient } = require("zeptomail");

// Initialize Zeptomail client
const zeptoMailUrl = "api.zeptomail.in/";
const zeptoMailToken =
    "Zoho-enczapikey PHtE6r0PSu7ii2R+8EcHsPK8H8L3MYt69btkLANPsIlKA/cHS01VrdgimjC3+BguBPEXE/KfyIJgt72c5r6BJmzlZ2ZOX2qyqK3sx/VYSPOZsbq6x00VsV0Yc0TaUI/mcd5o1STQvdnYNA==";
const zeptoMailClient = new SendMailClient({
    url: zeptoMailUrl,
    token: zeptoMailToken,
});

// POST route for order confirmation
router.post("/", async (req, res) => {
    try {
        const { orderID } = req.body;
        const response = await axios.get(
            `https://api.digiblocks.tech/allOrders/${orderID}`
        );
        const orderData = response.data;
        const userEmail =
            orderData.customerInfo.shipping.email;
        const userName =
            orderData.customerInfo.shipping
                .customerName;
        const orderDate = new Date(
            orderData.timeOfPayment
        ).toLocaleString();
        const address_street =
            orderData.customerInfo.shipping.street;
        const address_city =
            orderData.customerInfo.shipping.city;
        const address_state =
            orderData.customerInfo.shipping.state;
        const address_country =
            orderData.customerInfo.shipping.country;
        const pincode =
            orderData.customerInfo.shipping.zipCode;

        const userCurrency = orderData.userCurrency;
        const finalAmount = orderData.finalAmount;
        const discount = orderData.discount;
        const paymentMethod = orderData.paymentMethod;

        const currencyIcon = userCurrency === "INR" ? "₹" : "$";

        const cartProducts = orderData.cartProducts;

        let tableRowsHTML = "";
        let totalPrice = 0;
        cartProducts.forEach((product, index) => {
            const backgroundColor =
                index % 2 === 0 ? "#F3F3FC" : "rgb(243, 243, 252)";
            const price = userCurrency === "INR" ? product.priceINR : product.priceUSD;
            const totalProductPrice = price * product.quantity;
            totalPrice += totalProductPrice;
            tableRowsHTML += `
                  <tr style="background-color: ${backgroundColor};">
                    <td style="border: 1px solid rgb(0, 204, 0); padding: 20px; word-break: break-word; line-height: 22px; width: 253.5px;">
                      <b>${product.title}</b><br>
                      Quantity: ${product.quantity}<br>
                      Price Per Item: ${currencyIcon}${price}<br>
                    </td>
                    <td style="border: 1px solid rgb(0, 204, 0); padding: 20px; word-break: break-word; line-height: 22px; width: 253.5px;">
                      <b>${currencyIcon}${totalProductPrice}</b><br>
                    </td>
                  </tr>
                `;
        });

        const emailPayload = {
            from: {
                address: "noreply@knitsilk.com",
                name: "KnitSilk",
            },
            to: [
                {
                    email_address: {
                        address: userEmail,
                        name: userName,
                    },
                },
                {
                    email_address: {
                        address: "orders@knitsilk.com",
                        name: "Orders",
                    },
                },
            ],

            subject: "🌟 Order Confirmation - KnitSilk 🌟",
            htmlbody: `
            <table cellspacing="0" cellpadding="0" style="background-color: #F3F3FC; width: 100%;">
            <tbody>
                    <tr>
                            <td>
                                    <div
                                            style="background-color: #fff; border: 1px solid #eee; box-sizing: border-box; font-family: Lato, Helvetica, 'Helvetica Neue', Arial, 'sans-serif'; margin: 40px auto; max-width: 600px; overflow: hidden; width: 600px;">
                                            <div style="display: flex; justify-content: center; padding-top: 20px;">
                                                    <img src="https://www.knitsilk.com/static/media/knitsilk%20black%20logo.42e4be1aa040e6f98e51.png" width="170" height="60" style="margin:auto;"><br>
                                            </div>
                                            <div style="padding: 30px 50px 50px;">
                                                    <p style="margin: 0px; line-height: 22px;">
                                                            <span class="size" style="font-size: 16px; margin: 0px; line-height: 22px;">Hi ${userName},</span><br>
                                                    </p>
                                                    <h4
                                                            style="color: #253745; font-size: 28px; font-weight: normal; margin: 0; margin: 30px 0;">
                                                            Thank you for your order!<br></h4>
                                                    <h4
                                                            style="color: #6667DA; font-size: 14px; font-weight: normal; margin-bottom: 20px;">
                                                            <span class="colour" style="color:rgb(0, 204, 0)"><b>Order Summary :</b></span><br>
                                                    </h4>
                                                    <div style="align-items: center; display: flex; line-height: 22px;">
                                                            <label style="width: 90px; word-break: break-word;">Order ID</label><span style="margin: 0 10px;">:</span>
                                                            <div><b>${orderID}</b><br></div>
                                                    </div>
                                                    <div style="align-items: center; display: flex; line-height: 22px;">
                                                            <label style="width: 90px; word-break: break-word;">Ordered On</label><span style="margin: 0 10px;">:</span>
                                                            <div>${orderDate}<br></div>
                                                    </div>
                                                    <div style="align-items: center; display: flex; line-height: 22px;">
                                                    <label style="width: 90px; word-break: break-word;">Total Amount</label><span style="margin: 0 10px;">:</span>
                                                    <div>${currencyIcon} ${finalAmount}<br></div>
                                                    </div>
                                                    <div style="align-items: center; display: flex; line-height: 22px;">
                                                    <label style="width: 90px; word-break: break-word;">Discount</label><span style="margin: 0 10px;">:</span>
                                                    <div>${currencyIcon} ${discount}<br></div>
                                                    </div>
                                                    <div style="align-items: center; display: flex; line-height: 22px;">
                                                    <label style="width: 90px; word-break: break-word;">Payment Method</label><span style="margin: 0 10px;">:</span>
                                                    <div>${paymentMethod}<br></div>
                                                    </div>

                                                    <table
                                                            style="border-collapse: collapse; font-size: 14px; margin: 40px 0px;">
                                                            <tbody>
                                                                    <tr>
                                                                            <td
                                                                                    style="border: 1px solid rgb(0, 204, 0); padding: 22px 20px; word-break: break-word; line-height: 22px; width: 253.5px;">
                                                                                    <b><span class="size" style="font-size: 16px">Product</span></b><br>
                                                                            </td>
                                                                            <td
                                                                                    style="border: 1px solid rgb(0, 204, 0); padding: 20px; word-break: break-word; line-height: 22px; width: 253.5px;">
                                                                                    <span class="size" style="font-size: 16px"><b>Amount</b></span><br>
                                                                            </td>
                                                                    </tr>
                                                                    <!-- Table body - Dynamically generated rows -->
                                                                    ${tableRowsHTML}
                                                                    
                                                            </tbody>
                                                    </table>
                                                    <h4
                                                            style="color: #6667DA; font-size: 14px; font-weight: normal; margin-bottom: 20px;">
                                                            <span class="colour" style="color:rgb(0, 204, 0)"><b>Order will be delivered to :</b></span><br>
                                                    </h4>
                                                    <p style="margin: 0px 0px 10px;">
                                                            <span class="colour" style="color:rgb(37, 55, 69)"><span class="size" style="font-size: 14px; margin: 0px 0px 10px;">${userName}</span></span><br>
                                                    </p>
                                                    <p style="margin: 0px 0px 10px;">
                                                            <span class="colour" style="color:rgb(37, 55, 69)"><span class="size" style="font-size: 14px; margin: 0px 0px 10px;">${address_street}</span></span><br>
                                                    </p>
                                                    <p style="margin: 0px 0px 10px;">
                                                            <span class="colour" style="color:rgb(37, 55, 69)"><span class="size" style="font-size: 14px; margin: 0px 0px 10px;">${address_city} - ${pincode}</span></span><br>
                                                    </p>
                                                    <p style="margin: 0px;">
                                                            <span class="colour" style="color:rgb(37, 55, 69)"><span class="size" style="font-size: 14px; margin: 0px;"> ${address_state}, ${address_country}</span></span><br>
                                                    </p>
                                                    <p style="line-height: 22px; margin-top: 30px;">
                                                            <span class="colour" style="color:rgb(37, 55, 69)"><span class="size" style="font-size: 14px; line-height: 22px; margin-top: 30px;">We will send you a confirmation email once your order is shipped.</span></span><br>
                                                    </p>
                                                  
                                                    <div style="text-align: center;"><a href="https://www.knitsilk.com/my-account/my-orders/${orderID}"
                                                                    style="background-color: rgb(0, 204, 0); border: none; color: #fff; cursor: pointer; display: inline-block; font-size: 16px; text-decoration: none; padding: 20px 32px;">View
                                                                More Details</a><br></div>
                                            </div>
                                    </div>
                            </td>
                    </tr>
            </tbody>
    </table>
    <div><br></div>
          
  `,
        };

        // Send email using Zeptomail
        await zeptoMailClient.sendMail(emailPayload);
        res.status(201).send({
            message: "Order confirmation email sent successfully!",
            orderData,
        });
    } catch (error) {
        console.error("Error sending order confirmation email:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
