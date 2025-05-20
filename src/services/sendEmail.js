const nodemailer = require("nodemailer");

const sendEmail = async (subject, emailContent) => {
  const transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_AUTH_USER,
      pass: process.env.MAILTRAP_AUTH_PASS,
    },
  });

  const mailOptions = {
    from,
    to,
    subject: subject,
    html: emailContent,
  };

  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
