const express = require('express');
const router = express.Router();
const { SendMailClient } = require("zeptomail");
const Otp = require('../models/Otp');

// Initialize Zeptomail client
const zeptoMailUrl = "api.zeptomail.in/";
const zeptoMailToken = "Zoho-enczapikey PHtE6r0PSu7ii2R+8EcHsPK8H8L3MYt69btkLANPsIlKA/cHS01VrdgimjC3+BguBPEXE/KfyIJgt72c5r6BJmzlZ2ZOX2qyqK3sx/VYSPOZsbq6x00VsV0Yc0TaUI/mcd5o1STQvdnYNA==";
const zeptoMailClient = new SendMailClient({ url: zeptoMailUrl, token: zeptoMailToken });

router.post('/accountCreation', async (req, res) => {
    try {
        const { email, userName } = req.body;

        const emailPayload = {
            from: {
                address: "noreply@knitsilk.com",
                name: "KnitSilk"
            },
            "to": [
                {
                    "email_address": {
                        "address": email,
                        "name": "KnitSilk"
                    }
                }
            ],
            subject: "Welcome to KnitSilk - Your Destination for Luxurious Silk Products! 🎉",
            htmlbody: `
            <div style="background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <div style="background-color: #f5f5f5; color: #fff; text-align: center; padding: 20px 0;">
                    <img src="https://knitsilk.netlify.app/static/media/knitsilk%20black%20logo.42e4be1aa040e6f98e51.png" alt="KnitSilk Logo" style="max-width: 200px; margin: 0 auto;">
                </div>
                <div style="padding: 40px;">
                    <h2 style="font-size: 24px; color: #333; margin-bottom: 20px;">Welcome to KnitSilk!</h2>
                    <p style="font-size: 16px; color: #555; line-height: 1.6;">Dear ${userName},</p>
                    <p style="font-size: 16px; color: #555; line-height: 1.6;">Thank you for joining us. We are thrilled to have you join our community!</p>
                    <p style="font-size: 16px; color: #555; line-height: 1.6;">At KnitSilk, we strive to provide you with the best shopping experience and a wide range of high-quality products. Your support means the world to us!</p>
                    <p style="font-size: 16px; color: #555; line-height: 1.6;">If you have any questions or need assistance, please feel free to contact us. We're here to help!</p>
                    <p style="font-size: 16px; color: #555; line-height: 1.6;">Once again, welcome to KnitSilk. Happy shopping!</p>
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="https://knitsilk.com" style="display: inline-block; background-color: #333; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 0px;">Start Shopping</a>
                    </div>
                </div>
                <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #888;">
                    &copy; 2024, KnitSilk. All Rights Reserved.
                </div>
            </div>
        </div>
        
                <div><br></div>
            `
        };

        // Send email using Zeptomail
        await zeptoMailClient.sendMail(emailPayload);
        res.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending Email:', error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;