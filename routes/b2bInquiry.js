const express = require('express');
const router = express.Router();
const B2BInquiry = require('../models/B2BInquiry');
const axios = require('axios');
const { SendMailClient } = require("zeptomail");

// Initialize Zeptomail client
const zeptoMailUrl = "api.zeptomail.in/";
const zeptoMailToken = "Zoho-enczapikey PHtE6r0PSu7ii2R+8EcHsPK8H8L3MYt69btkLANPsIlKA/cHS01VrdgimjC3+BguBPEXE/KfyIJgt72c5r6BJmzlZ2ZOX2qyqK3sx/VYSPOZsbq6x00VsV0Yc0TaUI/mcd5o1STQvdnYNA==";
const zeptoMailClient = new SendMailClient({ url: zeptoMailUrl, token: zeptoMailToken });


// POST route for B2B inquiry
router.post('/', async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            messages,
        } = req.body;

        // Save the B2B inquiry to the database
        const b2bInquiry = new B2BInquiry({
            name,
            email,
            phone,
            messages,
        });

        await b2bInquiry.save();

        // Construct email payload
        const emailPayload = {
            from: {
                address: "noreply@knitsilk.com",
                name: "KnitSilk"
            },
            "to":
                [
                    {
                        "email_address":
                        {
                            "address": email,
                            "name": name
                        }
                    },
                    {
                        "email_address": {
                            "address": "enquiry@knitsilk.com",
                            "name": "Admin"
                        }
                    }
                ],

            subject: '🌟 B2B Inquiry Confirmation - Knitsilk 🌟',
            htmlbody: `
            <div style="font-family: 'Arial', sans-serif; text-align: center; background-color: #f8f8f8; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          
              <img src="https://knitsilk.netlify.app/static/media/Knitsilk%20logo.3188ad111cd972e3b365.png" alt="Knitsilk Logo" style="max-width: 200px; height: auto; margin-bottom: 20px;">
          
              <h2 style="color: #333; margin-bottom: 20px;">B2B Inquiry Confirmation</h2>
          
              <p style="color: #555; font-size: 16px;">Dear ${name},</p>
          
              <p style="color: #555; font-size: 16px;">Thank you for submitting your B2B inquiry. We have received the following details:</p>
          
              <!-- Include the details in the email content -->
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 10px;"><strong>Email:</strong> ${email}</li>
                <li style="margin-bottom: 10px;"><strong>Phone:</strong> ${phone}</li>
                <li style="margin-bottom: 10px;"><strong>Enquiry:</strong> ${messages}</li>
                <!-- Include other details as needed -->
              </ul>
          
              <p style="color: #555; font-size: 16px;">We will review your inquiry and get back to you as soon as possible. If you have any further questions, feel free to contact us.</p>          
              <!-- Footer -->
              <div style="background-color: #6FA82F; color: white; padding: 10px; text-align: center; border-radius: 0 0 5px 5px;">
                <p>Best Regards,<br>The Knitsilk Team</p>
                <a href="https://www.knitsilk.com/" style="color: white; text-decoration: none;">https://www.knitsilk.com/</a>
              </div>
          
            </div>
          </div>
          
  `,
        };

        // Send email using Zeptomail
        await zeptoMailClient.sendMail(emailPayload);
        res.status(201).send('B2B Inquiry submitted successfully!');
    } catch (error) {
        console.error('Error submitting B2B Inquiry:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET route to retrieve all B2B inquiries
router.get('/', async (req, res) => {
    try {
        const inquiries = await B2BInquiry.find();
        res.status(200).json(inquiries);
    } catch (error) {
        console.error('Error fetching B2B Inquiries:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedInquiry = await B2BInquiry.findByIdAndDelete(id);

        if (!deletedInquiry) {
            return res.status(404).send('B2B Inquiry not found');
        }

        res.status(200).send('B2B Inquiry deleted successfully');
    } catch (error) {
        console.error('Error deleting B2B Inquiry:', error);
        res.status(500).send('Internal Server Error');
    }
});


// POST route for B2B inquiry
router.post('/b2bReply', async (req, res) => {
    try {
        const {
            name,
            email,
            messages,
        } = req.body;

        // Construct email payload
        const emailPayload = {
            from: {
                address: "enquiry@knitsilk.com",
                name: "KnitSilk"
            },
            "to":
                [
                    {
                        "email_address":
                        {
                            "address": email,
                            "name": name
                        }
                    }
                ],

            subject: '🌟 B2B Inquiry Reply - Knitsilk 🌟',
            htmlbody: `
                    <div style="font-family: 'Arial', sans-serif; text-align: center; background-color: #f8f8f8; padding: 20px;">
                      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">

                       <img src="https://knitsilk.netlify.app/static/media/Knitsilk%20logo.3188ad111cd972e3b365.png" alt="Knitsilk Logo" style="max-width: 200px; height: auto; margin-bottom: 20px;">

                         <h2 style="color: #333; margin-bottom: 20px;">B2B Inquiry Reply</h2>

                         <p style="color: #555; font-size: 16px;">Dear ${name},</p>

                          <p style="color: #555; font-size: 16px;">Thank you for your inquiry. We have reviewed it and here is our response:</p>

                             <!-- Include the reply in the email content -->
                               <ul style="list-style: none; padding: 0; margin: 0;">
                             <li style="margin-bottom: 10px;">${messages}</li>
                                </ul>

                            <p style="color: #555; font-size: 16px;">If you have any further questions or need assistance, feel free to contact us.</p>          
                           <!-- Footer -->
                               <div style="background-color: #6FA82F; color: white; padding: 10px; text-align: center; border-radius: 0 0 5px 5px;">
                                 <p>Best Regards,<br>The Knitsilk Team</p>
                            <a href="https://www.knitsilk.com/" style="color: white; text-decoration: none;">https://www.knitsilk.com/</a>
                        </div>

</div>
</div>

`,
        };

        // Send email using Zeptomail
        await zeptoMailClient.sendMail(emailPayload);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error submitting B2B Inquiry:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
