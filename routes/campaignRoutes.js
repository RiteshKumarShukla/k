const express = require("express");
const { SendMailClient } = require("zeptomail");

const router = express.Router();


// Zeptomail configuration
const url = "api.zeptomail.in/";
const token = "Zoho-enczapikey PHtE6r0PSu7ii2R+8EcHsPK8H8L3MYt69btkLANPsIlKA/cHS01VrdgimjC3+BguBPEXE/KfyIJgt72c5r6BJmzlZ2ZOX2qyqK3sx/VYSPOZsbq6x00VsV0Yc0TaUI/mcd5o1STQvdnYNA==";
const client = new SendMailClient({ url, token });

// Route to send email
router.get("/campaign", async (req, res) => {
    try {
        const receivers = [
            {
                "email_address": {
                    "address": "riteshshuklagem@gmail.com",
                    "name": "Receiver 1"
                }
            },
            {
                "email_address": {
                    "address": "ritesh.digiblocks@gmail.com",
                    "name": "Receiver 2"
                }
            }
            // Add more receivers as needed
        ];

        const response = await client.sendMail({
            "from": {
                "address": "noreply@globaltexmart.com",
                "name": "noreply"
            },
            "to": receivers,
            "subject": "Test Email",
            "htmlbody": "<div><b> Test Bulk email sent successfully.</b></div>",
        });

        console.log("Email sent successfully:", response);
        res.send("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
    }
});

module.exports = router;
