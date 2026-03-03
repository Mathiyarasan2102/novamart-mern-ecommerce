const nodemailer = require("nodemailer");

const sendVisitNotification = async (req, res) => {
    try {
        const { userAgent } = req.body;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: process.env.SMTP_EMAIL, // Sending the notification to the site owner
            subject: "🚨 New Visitor on Nova Mart!",
            html: `
                <h2>Someone just visited your Nova Mart website!</h2>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Device Info:</strong> ${userAgent || "Unknown"}</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "Notification sent successfully",
        });
    } catch (error) {
        console.error("Error sending visit notification:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while sending notification",
        });
    }
};

module.exports = {
    sendVisitNotification,
};
