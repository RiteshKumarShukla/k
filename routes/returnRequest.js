// routes/returnRequest.js
const express = require('express');
const router = express.Router();
const ReturnRequest = require('../models/OrderReturnRequets');
const { authenticate } = require("../middleware/authenticate");

router.post('/returnRequests', authenticate, async (req, res) => {
    const { order, returnReason, additionalInfo,orderId } = req.body;
    try {
        const returnRequest = new ReturnRequest({
            order,
            orderId,
            returnReason,
            additionalInfo,
            userID: req.userID,
        });
        await returnRequest.save();
        res.status(201).json({ message: 'Return request submitted successfully', returnRequest });
    } catch (error) {
        console.error('Error submitting return request:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/returnRequests', async (req, res) => {
    try {
        const returnRequests = await ReturnRequest.find();
        res.status(200).json(returnRequests);
    } catch (error) {
        console.error('Error fetching return requests:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get("/returnRequests/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const returnRequest = await ReturnRequest.findById(id);

        if (!returnRequest) {
            return res.status(404).json({ message: "Return request not found" });
        }

        res.status(200).json(returnRequest);
    } catch (error) {
        console.error("Error fetching return request by ID:", error);
        res.status(500).json({ message: "Server error" });
    }
});


router.put('/returnRequests/:id', async (req, res) => {
    const { id } = req.params;
    const { status, rejectionReason } = req.body; 

    try {
        // Find the return request by ID
        const returnRequest = await ReturnRequest.findById(id);

        if (!returnRequest) {
            return res.status(404).json({ message: 'Return request not found' });
        }

        // Update the status and rejection reason (if provided)
        returnRequest.status = status;
        if (status === 'Rejected' && rejectionReason) {
            returnRequest.rejectionReason = rejectionReason;
        }

        await returnRequest.save(); // Save changes to DB

        res.status(200).json(returnRequest); // Send updated request back
    } catch (error) {
        console.error('Error updating return request:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/orderIds', async (req, res) => {
    try {
        // Find all return requests and select only the orderId field
        const returnRequests = await ReturnRequest.find({}, 'orderId');
        
        // Extract orderId from each document and convert it to an array of strings
        const orderIds = returnRequests.map(request => request.orderId);

        // Send the array of orderIds as a response
        res.status(200).json(orderIds);
    } catch (error) {
        console.error('Error fetching order IDs:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
