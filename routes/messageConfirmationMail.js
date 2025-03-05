const express = require('express');
const router = express.Router();
const axios = require('axios');
const { SendMailClient } = require("zeptomail");

const zeptoMailUrl = "api.zeptomail.in/";
const zeptoMailToken = "Zoho-enczapikey PHtE6r0PSu7ii2R+8EcHsPK8H8L3MYt69btkLANPsIlKA/cHS01VrdgimjC3+BguBPEXE/KfyIJgt72c5r6BJmzlZ2ZOX2qyqK3sx/VYSPOZsbq6x00VsV0Yc0TaUI/mcd5o1STQvdnYNA==";
const zeptoMailClient = new SendMailClient({ url: zeptoMailUrl, token: zeptoMailToken });

router.post('/admin', async (req, res) => {
    const { userName, message } = req.body;
    console.log(userName,message);
    try {
        const emailPayload = {
            from: {
                address: "noreply@knitsilk.com",
                name: "KnitSilk"
            },
            to: [
                {
                    email_address: {
                        address: 'message.knitsilk@gmail.com',
                        name: "Admin"
                    }
                }
            ],
            subject: '🌟 New Message Received - Knitsilk 🌟',
            htmlbody: `
          <div style="font-family: 'Arial', sans-serif; text-align: center; background-color: #f8f8f8; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
              <img src="https://knitsilk.netlify.app/static/media/Knitsilk%20logo.3188ad111cd972e3b365.png" alt="Knitsilk Logo" style="max-width: 200px; height: auto; margin-bottom: 20px;">
              <h2 style="color: #333; margin-bottom: 20px;">New Message Received</h2>
              <p style="color: #555; font-size: 16px; margin-bottom: 20px;">Hello Admin,</p>
              <p style="color: #555; font-size: 16px; margin-bottom: 20px;">You have received a new message from <strong>${userName}</strong>.</p>
              <p style="color: #555; font-size: 16px; margin-bottom: 20px;">Message: ${message}</p>
              <p style="color: #555; font-size: 16px; margin-bottom: 20px;">Please review the message and respond accordingly.</p>
              <p style="color: #555; font-size: 16px; margin-bottom: 20px;">Thank you!</p>
            </div>
          </div>
        `,
        };

        // Send email using Zeptomail
        await zeptoMailClient.sendMail(emailPayload);
        res.status(201).send('Message Confirmation Mail sent successfully!');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});


router.post('/user', async (req, res) => {
    try {
        const {
            email,
        } = req.body;

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
                            "name": "Customer"
                        }
                    }
                ],
            subject: '🌟 New Message Received - Knitsilk 🌟',
            htmlbody: `
                <div style="font-family: 'Arial', sans-serif; text-align: center; background-color: #f8f8f8; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                
                    <img src="https://knitsilk.netlify.app/static/media/Knitsilk%20logo.3188ad111cd972e3b365.png" alt="Knitsilk Logo" style="max-width: 200px; height: auto; margin-bottom: 20px;">
                    
                    <h2 style="color: #333; margin-bottom: 20px;">New Message Received</h2>
                    
                    <p style="color: #555; font-size: 16px; margin-bottom: 20px;">Hello ,</p>
                    
                    <p style="color: #555; font-size: 16px; margin-bottom: 20px;">You have received a new message from KnitSilk. Please review the message and respond accordingly.</p>
                    <p style="color: #555; font-size: 16px; margin-bottom: 20px;">Thank you!</p>
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

module.exports = router;
