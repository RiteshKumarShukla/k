// bigOrderRoutes.js

const express = require('express');
const router = express.Router();
const Discount = require('../models/Discount');

// Create a new discount
router.post('/', async (req, res) => {
    const { priceINR, priceUSD, priceEUR, priceGBP, priceCAD, priceAUD, priceJPY, discount, startDate, endDate } = req.body;

    // Ensure at least one price threshold and the discount details are provided
    if (!priceINR && !priceUSD && !priceEUR && !priceGBP && !priceCAD && !priceAUD && !priceJPY) {
        return res.status(400).json({ error: 'At least one price threshold is required' });
    }
    if (!discount || !startDate || !endDate) {
        return res.status(400).json({ error: 'Discount, startDate, and endDate are required' });
    }

    // Create a new discount object with the provided data
    const newDiscount = new Discount({
        priceINR,
        priceUSD,
        priceEUR,
        priceGBP,
        priceCAD,
        priceAUD,
        priceJPY,
        discount,
        startDate,
        endDate,
    });

    try {
        // Save the discount to the database
        await newDiscount.save();
        res.status(200).json({ message: 'Discount created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create discount' });
    }
});



// Get all discounts
router.get('/', async (req, res) => {
    try {
        const discounts = await Discount.find();
        res.status(200).json(discounts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve discounts' });
    }
});

// Delete a discount by ID
router.delete('/:id', async (req, res) => {
    try {
        const discount = await Discount.findByIdAndDelete(req.params.id);
        if (!discount) {
            return res.status(404).json({ error: 'Discount not found' });
        }
        res.status(200).json({ message: 'Discount deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete discount' });
    }
});

//update discount
router.put('/:id', async (req, res) => {
    const { discount, priceINR, priceUSD, priceEUR, priceGBP, priceCAD, priceAUD, priceJPY, startDate, endDate } = req.body;

    // Ensure that the necessary fields are provided
    if (!discount || !startDate || !endDate) {
        return res.status(400).json({ error: 'Discount, startDate, and endDate are required' });
    }

    if (!priceINR && !priceUSD && !priceEUR && !priceGBP && !priceCAD && !priceAUD && !priceJPY) {
        return res.status(400).json({ error: 'At least one price threshold is required' });
    }

    try {
        const updatedDiscount = await Discount.findByIdAndUpdate(
            req.params.id,
            { discount, priceINR, priceUSD, priceEUR, priceGBP, priceCAD, priceAUD, priceJPY, startDate, endDate },
            { new: true, runValidators: true }
        );

        if (!updatedDiscount) {
            return res.status(404).json({ error: 'Discount not found' });
        }

        res.status(200).json(updatedDiscount);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update discount' });
    }
});


module.exports = router;
