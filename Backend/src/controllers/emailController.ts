import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

// Create transporter using SMTP credentials
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT as unknown as number,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

async function sendSuggestionEmail(req: Request, res: Response): Promise<void> {
    try {
        const { name, email, category, suggestion } = req.body;

        if (!name || !email || !category || !suggestion) {
            res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
            return;
        }

        // Email content
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: process.env.COMPANY_EMAIL,
            subject: `New Suggestion: ${category.toUpperCase()}`,
            html: `
                <h2>New Suggestion Received</h2>
                <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Category:</strong> ${category}</p>
                <p><strong>Suggestion:</strong></p>
                <p>${suggestion}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'Suggestion sent successfully'
        });
    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send suggestion'
        });
    }
}

export {
    sendSuggestionEmail
};
