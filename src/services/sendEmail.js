const nodemailer = require("nodemailer");

const sendEmail = (to, subject, emailContent) => {
  const transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_AUTH_USER,
      pass: process.env.MAILTRAP_AUTH_PASS,
    },
  });

  const mailOptions = {
    from: "mail@ecommerce.com",
    to: to,
    subject: subject,
    html: emailContent,
  };

  transport.sendMail(mailOptions);
};

module.exports = sendEmail;
