const express = require('express');
const router = express.Router();
const { SendMailClient } = require("zeptomail");
const Otp = require('../models/Otp');

// Initialize Zeptomail client
const zeptoMailUrl = "api.zeptomail.in/";
const zeptoMailToken = "Zoho-enczapikey PHtE6r0PSu7ii2R+8EcHsPK8H8L3MYt69btkLANPsIlKA/cHS01VrdgimjC3+BguBPEXE/KfyIJgt72c5r6BJmzlZ2ZOX2qyqK3sx/VYSPOZsbq6x00VsV0Yc0TaUI/mcd5o1STQvdnYNA==";
const zeptoMailClient = new SendMailClient({ url: zeptoMailUrl, token: zeptoMailToken });


router.post('/', async (req, res) => {
    try {
        const { email } = req.body;

        // Construct email payload
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
            subject: "Password Reset Successful - Knitsilk",
            htmlbody: `
            <div
            style="border: solid 1px #E5E5E5;border-radius: 5px;margin:0px auto; max-width:600px;width:600px;background:#fff;font-family: Lato, Helvetica, 'Helvetica Neue', Arial, 'sans-serif';">
            <table cellspacing="0" cellpadding="0" style="width: 100%;font-size: 14px;">
                <tbody>
                    <tr>
                        <td style="padding:32px">
                            <div>
                                <h1 style="margin: 0 0 32px;font-size:20px;text-align:center">
                                    <span><img src="https://knitsilk.netlify.app/static/media/knitsilk%20black%20logo.42e4be1aa040e6f98e51.png" width="150" height="54" orig_width="500" orig_height="181"></span><br>
                                </h1>
                            </div>
                            <div
                                style="background: #fff;border-radius: 10px;overflow: hidden;border: solid 1px #E5E5E5;border-radius: 10px;">
                                <table cellspacing="0" cellpadding="0" style="width:100%;font-size: 14px;">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div style="padding: 32px 24px;text-align: center;">
                                                    <h2 style="margin:0 0 20px;font-size: 20px;">Password Reset Successful</h2>
                                                    <div>
                                                        <span class="size" style="font-size:16px">Hello,</span><br>
                                                    </div>
                                                    <p style="line-height: 1.6; margin: 24px 0px 0px;">
                                                        <span class="size" style="font-size: 16px">Your password has been successfully reset. You can now log in to your account using your new password.</span><br>
                                                    </p>
                                                    <p style="line-height: 1.6; margin: 24px 0px 0px;">
                                                        <span class="size" style="font-size: 16px">If you did not request this change, please contact our support team immediately.</span><br>
                                                    </p>
                                                    <div style="margin-top: 32px;line-height: 1.6;">
                                                        <p style="margin: 0px;">
                                                            <span class="size" style="font-size: 13px; margin: 0px;">Thank you for using KnitSilk!</span><br>
                                                        </p>
                                                        <h3 style="font-size: 15px; margin: 4px 0 0;">Team KnitSilk</h3>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div style="margin-top: 32px;color:#888;text-align:center;">
                                <div style="margin-bottom: 8px;font-size:11px;">© 2024, KnitSilk. All Rights Reserved.<br></div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div><br></div>
            `
        };

        // Send email using Zeptomail
        await zeptoMailClient.sendMail(emailPayload);
        res.json({ success: true, message: 'Password Reset mail sent successfully' });
    } catch (error) {
        console.error('Error sending mail:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;