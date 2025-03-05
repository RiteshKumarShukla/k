const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const router = express.Router();

router.post('/create-cashfree-order', async (req, res) => {
    const { orderAmount, customerName, customerEmail, customerPhone, userCurrency } = req.body;

    // Generate a valid customer_id from customerEmail
    const customerId = customerEmail.replace(/[^a-zA-Z0-9_\-]/g, '_');

    console.log('Request Data:', {
        orderAmount,
        customerName,
        customerEmail,
        customerPhone,
        userCurrency,
        customerId // Log the customerId being used
    });

    try {
        const requestBody = {
            order_amount: orderAmount,
            order_currency: userCurrency,
            customer_details: {
                customer_id: customerId,
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: customerPhone,
            }
        };

        console.log('Cashfree Request Body:', requestBody);

        const cashfreeResponse = await fetch('https://api.cashfree.com/pg/orders', {
            method: 'POST',
            headers: {
                'X-Client-Secret': process.env.CASHFREE_CLIENT_SECRET,
                'X-Client-Id': process.env.CASHFREE_CLIENT_ID,
                'x-api-version': '2023-08-01',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!cashfreeResponse.ok) {
            const errorResponse = await cashfreeResponse.json();
            console.error('Cashfree API Error:', errorResponse);
            throw new Error(`Cashfree HTTP error! Status: ${cashfreeResponse.status} - ${errorResponse.message}`);
        }

        const cashfreeData = await cashfreeResponse.json();
        res.status(200).json(cashfreeData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating order with Cashfree', error: error.message });
    }
});


// GET Route to Fetch Cashfree Order Details
router.get('/cashfree/order/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
    const url = `https://api.cashfree.com/pg/orders/${orderId}`;

    try {
        const cashfreeResponse = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'x-api-version': '2023-08-01',
                'X-Client-Secret': process.env.CASHFREE_CLIENT_SECRET,
                'X-Client-Id': process.env.CASHFREE_CLIENT_ID,
            }
        });

        if (!cashfreeResponse.ok) {
            const errorResponse = await cashfreeResponse.json();
            console.error('Cashfree API Error:', errorResponse);
            throw new Error(`Cashfree HTTP error! Status: ${cashfreeResponse.status} - ${errorResponse.message}`);
        }

        const cashfreeData = await cashfreeResponse.json();
        res.status(200).json(cashfreeData);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'Error fetching order details from Cashfree', error: error.message });
    }
});

module.exports = router;
