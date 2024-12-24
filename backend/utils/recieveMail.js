const sgMail = require('@sendgrid/mail');

// Set your SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (options) => {
  const msg = {
    to: options.email, // Recipient's email address
    from: process.env.SENDGRID_EMAIL, // Your verified SendGrid email address
    subject: options.subject,
    text: options.message,
    html: options.htmlMessage, // Use HTML for rich formatting
  };

  // Send the email
  await sgMail.send(msg);
};

module.exports = sendEmail;
